// Converts a Scholarship row from our database into the shape the frontend expects.

const ALL_CATEGORIES = ["General", "EWS", "OBC", "SC", "ST", "Minority"];
const GOV_WORDS = ["govt", "government", "ministry", "department", "aicte", "ugc"];

// "2027-01-10" -> "January 10, 2027"
function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

// "₹12,000/year" -> 12000 (0 if there is no number in the text)
function parseAmount(text) {
  const match = String(text || "").replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

// 350000 -> "Under ₹3.5 Lakhs"; null -> "No Income Limit"
function formatIncomeLimit(maxIncome) {
  if (maxIncome == null) return "No Income Limit";
  return `Under ₹${Number((maxIncome / 100000).toFixed(2))} Lakhs`;
}

// score = optional 0-100 match percentage for the logged-in student
function toFrontendShape(s, score) {
  const provider = s.provider || "";
  const isGov = GOV_WORDS.some((w) => provider.toLowerCase().includes(w));
  const incomeLimit = formatIncomeLimit(s.max_income);
  const state = s.state === "All" ? "All-India" : s.state;
  const matchScore = typeof score === "number" ? score : 0;

  let otherConditions = "See the official notification for full conditions.";
  if (s.gender_required === "Female") otherConditions = "Open to female students only.";
  if (s.requires_disability) otherConditions = "Open to students with disabilities only.";

  return {
    id: s.id,
    name: s.name,
    provider,
    amount: s.amount,
    amountValue: parseAmount(s.amount),
    eligibilityMatch: matchScore,
    categoryBadge: isGov ? "Government Scheme" : "Private Scholarship",
    deadline: formatDate(s.deadline),
    deadlineDate: s.deadline,
    educationLevel:
      s.education_level === "All" ? ["Undergraduate", "Postgraduate"] : [s.education_level],
    eligibleCategories: s.category === "All" ? ALL_CATEGORIES : [s.category],
    state,
    incomeLimit,
    scholarshipType: [s.max_income == null ? "Merit-Based" : "Need-Based", isGov ? "Government" : "Private"],
    shortDescription: s.eligibility_text,
    detailedAbout: s.eligibility_text,
    structuredEligibility: {
      educationLevel: s.education_level,
      academicPerformance: "See the official notification.",
      annualIncome: incomeLimit,
      categoryRequirements: s.category === "All" ? "Open to all categories." : s.category,
      domicileRequirements: state,
      otherConditions,
    },
    structuredBenefits: {
      financialAmount: s.amount,
      tuitionSupport: "See the official notification.",
      additionalBenefits: "See the official notification.",
    },
    matchExplanation: {
      percentage: matchScore,
      summary: "Eligibility is checked against your saved profile.",
      matchedCriteria: [],
      pendingVerification: [],
    },
    applicationSteps: [
      { step: 1, title: "Visit the official portal", description: s.link || "See the official website." },
    ],
    details: {
      overview: s.eligibility_text,
      eligibility: [s.eligibility_text],
      benefits: s.amount,
      documentsRequired: [],
    },
    link: s.link,
    keywords: [],
    genderRequired: s.gender_required,
    requiresDisability: s.requires_disability,
    isSampleData: true, // our seed data is approximate; set to false after verifying on official portals
  };
}

module.exports = { toFrontendShape };