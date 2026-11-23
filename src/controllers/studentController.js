const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const {
  EMPTY_PROFILE,
  validateDetails,
  sanitizeDetails,
  toDatabaseColumns,
} = require("../utils/profileMapper");

// GET /api/student/profile : the logged-in student's profile, in the frontend's shape
async function getStudentProfile(req, res) {
  try {
    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });
    const user = await User.findByPk(req.user.id, { attributes: ["email"] });

    res.json({
      ...EMPTY_PROFILE,
      email: user ? user.email : "",
      ...(profile && profile.details ? profile.details : {}),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching the profile" });
  }
}

// PUT /api/student/profile : save the full profile form
// The full form is stored as-is, and the fields used for matching are filled in too.
async function updateStudentProfile(req, res) {
  try {
    const problem = validateDetails(req.body);
    if (problem) {
      return res.status(400).json({ error: problem });
    }

    const details = { ...EMPTY_PROFILE, ...sanitizeDetails(req.body) };
    const columns = toDatabaseColumns(details);

    let profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });

    if (profile) {
      await profile.update({ ...columns, details });
    } else {
      profile = await StudentProfile.create({ user_id: req.user.id, ...columns, details });
    }

    res.json({ ...details, updatedAt: profile.updatedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong saving the profile" });
  }
}

module.exports = { getStudentProfile, updateStudentProfile };