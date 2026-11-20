const StudentProfile = require("../models/StudentProfile");

// Allowed values. These MUST match the dropdown values the frontend sends.
const EDUCATION_LEVELS = ["School", "Undergraduate", "Postgraduate"];
const CATEGORIES = ["General", "EWS", "OBC", "SC", "ST", "Minority"];
const GENDERS = ["Male", "Female", "Other"];

// The fields a student is allowed to set on their own profile
const PROFILE_FIELDS = [
  "education_level",
  "field_of_study",
  "income_bracket",
  "family_income",
  "category",
  "state",
  "gender",
  "has_disability",
];

// Picks only the allowed fields from the request body
function pickProfileFields(body) {
  const data = {};
  for (const field of PROFILE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

// Returns an error message if any provided field is invalid, otherwise null
function validateProfile(data) {
  if (data.education_level !== undefined && !EDUCATION_LEVELS.includes(data.education_level)) {
    return `education_level must be one of: ${EDUCATION_LEVELS.join(", ")}`;
  }
  if (data.category !== undefined && !CATEGORIES.includes(data.category)) {
    return `category must be one of: ${CATEGORIES.join(", ")}`;
  }
  if (data.gender !== undefined && !GENDERS.includes(data.gender)) {
    return `gender must be one of: ${GENDERS.join(", ")}`;
  }
  if (data.family_income !== undefined) {
    if (!Number.isInteger(data.family_income) || data.family_income < 0) {
      return "family_income must be a whole number of rupees, 0 or more";
    }
  }
  if (data.has_disability !== undefined && typeof data.has_disability !== "boolean") {
    return "has_disability must be true or false";
  }
  for (const field of ["field_of_study", "income_bracket", "state"]) {
    if (data[field] !== undefined) {
      if (typeof data[field] !== "string" || data[field].trim() === "" || data[field].length > 100) {
        return `${field} must be a non-empty text of at most 100 characters`;
      }
    }
  }
  return null;
}

// GET /api/profiles/me
async function getMyProfile(req, res) {
  try {
    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "No profile found for this user yet" });
    }

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching the profile" });
  }
}

// POST /api/profiles/me  (create or update)
async function upsertMyProfile(req, res) {
  try {
    const data = pickProfileFields(req.body);

    const problem = validateProfile(data);
    if (problem) {
      return res.status(400).json({ error: problem });
    }

    let profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });

    if (profile) {
      await profile.update(data);
    } else {
      profile = await StudentProfile.create({ user_id: req.user.id, ...data });
    }

    res.json({ message: "Profile saved successfully", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong saving the profile" });
  }
}

module.exports = { getMyProfile, upsertMyProfile };