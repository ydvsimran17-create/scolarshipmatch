const Scholarship = require("../models/Scholarship");
const StudentProfile = require("../models/StudentProfile");
const { getEmbedding, cosineSimilarity } = require("../utils/embeddings");
const { isEligible } = require("../utils/eligibility");

// GET /api/scholarships  — list all scholarships (no matching, just browse)
async function listScholarships(req, res) {
  try {
    const scholarships = await Scholarship.findAll();
    res.json({ count: scholarships.length, scholarships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching scholarships" });
  }
}

// GET /api/scholarships/matches — eligible scholarships, ranked by AI similarity
async function getMatches(req, res) {
  try {
    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      return res.status(404).json({ error: "Please complete your profile before matching" });
    }

    const allScholarships = await Scholarship.findAll();

    // Stage 1: remove scholarships the student can't apply to
    const eligible = allScholarships.filter((s) => s.embedding && isEligible(s, profile));

    // Stage 2: rank the remaining ones by how close they are to the student's profile
    const profileText = `Student profile: education level ${profile.education_level}, field of study ${profile.field_of_study}, income bracket ${profile.income_bracket}, category ${profile.category}, state ${profile.state}.`;
    const profileEmbedding = await getEmbedding(profileText);

    const matches = eligible
      .map((s) => ({
        id: s.id,
        name: s.name,
        provider: s.provider,
        eligibility_text: s.eligibility_text,
        amount: s.amount,
        deadline: s.deadline,
        link: s.link,
        score: Math.round(cosineSimilarity(profileEmbedding, s.embedding) * 100),
      }))
      .sort((a, b) => b.score - a.score);

    res.json({
      total_scholarships: allScholarships.length,
      eligible_count: matches.length,
      matches,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong finding matches" });
  }
}

module.exports = { listScholarships, getMatches };