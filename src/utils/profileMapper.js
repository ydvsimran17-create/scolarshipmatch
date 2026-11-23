// Converts the frontend's profile form (24 text fields) into our database columns,
// so the eligibility rules and AI matching keep working.

// The only fields we accept from the frontend profile form
const PROFILE_KEYS = [
  "fullName", "email", "phone", "dob", "gender", "state", "city",
  "educationLevel", "institution", "course", "yearOfStudy", "marksPercentage", "academicYear",
  "annualIncome", "incomeCertificateStatus", "familyOccupation",
  "category", "domicileState", "disabilityStatus", "minorityStatus",
  "preferredScholarshipType", "careerGoals", "areasOfInterest", "aspirationsDescription",
];

// A blank profile (used when a new student has not saved anything yet)
const EMPTY_PROFILE = Object.fromEntries(PROFILE_KEYS.map((k) => [k, ""]));

// Returns an error message if the request body is not a valid profile, otherwise null
function validateDetails(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Profile must be an object";
  }
  for (const key of PROFILE_KEYS) {
    if (body[key] !== undefined && typeof body[key] !== "string") {
      return `${key} must be text`;
    }
  }
  return null;
}

// Keeps only the known fields, as trimmed text of at most 2000 characters
function sanitizeDetails(body) {
  const clean = {};
  for (const key of PROFILE_KEYS) {
    if (typeof body[key] === "string") clean[key] = body[key].trim().slice(0, 2000);
  }
  return clean;
}

// "Undergraduate (B.Tech / ...)" -> "Undergraduate"
// Approximations: Doctoral -> Postgraduate, Diploma -> Undergraduate
function mapEducationLevel(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  if (t.startsWith("undergraduate")) return "Undergraduate";
  if (t.startsWith("postgraduate") || t.startsWith("doctoral")) return "Postgraduate";
  if (t.startsWith("diploma")) return "Undergraduate";
  if (t.startsWith("higher secondary")) return "School";
  return null;
}

// "SC (Scheduled Castes)" -> "SC". "Other" has no match, so it becomes null
// (the student then only sees scholarships open to all categories)
function mapCategory(text) {
  if (!text) return null;
  const first = text.split(/[\s(]/)[0].toUpperCase();
  if (first === "GENERAL") return "General";
  if (["OBC", "SC", "ST", "EWS"].includes(first)) return first;
  if (first === "MINORITY") return "Minority";
  return null;
}

// "Delhi (NCT)" -> "Delhi"
function mapState(text) {
  if (!text) return null;
  return text.replace(/\s*\(.*\)\s*$/, "").trim() || null;
}

function mapGender(text) {
  return ["Male", "Female", "Other"].includes(text) ? text : null;
}

// "None" / "No" / "Not Applicable" / empty -> false, anything else -> true
function mapDisability(text) {
  if (!text) return false;
  return !/^(none|no|not applicable|n\/a)/i.test(text.trim());
}

// The form only gives an income range, not an exact number. We store the LOWER end of the
// range, so a student is never wrongly hidden from a scholarship they might qualify for.
function incomeFromSlab(label) {
  if (!label) return null;
  if (label.startsWith("Under")) return 0;
  if (label.startsWith("Above")) return 800001;
  const m = label.replace(/,/g, "").match(/₹(\d+)/);
  return m ? Number(m[1]) : null;
}

// Frontend profile -> database columns used by the eligibility rules and AI matching
function toDatabaseColumns(details) {
  return {
    education_level: mapEducationLevel(details.educationLevel),
    field_of_study: details.course || null,
    income_bracket: details.annualIncome || null,
    family_income: incomeFromSlab(details.annualIncome),
    category: mapCategory(details.category),
    state: mapState(details.domicileState || details.state),
    gender: mapGender(details.gender),
    has_disability: mapDisability(details.disabilityStatus),
  };
}

module.exports = { PROFILE_KEYS, EMPTY_PROFILE, validateDetails, sanitizeDetails, toDatabaseColumns };