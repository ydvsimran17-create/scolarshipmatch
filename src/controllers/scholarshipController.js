const Scholarship = require("../models/Scholarship");
const StudentProfile = require("../models/StudentProfile");
const { getEmbedding, cosineSimilarity } = require("../utils/embeddings");
const { isEligible } = require("../utils/eligibility");
const { toFrontendShape } = require("../utils/scholarshipMapper");

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INCOME_LIMITS = {
  "Under ₹2.5 Lakhs": 250000,
  "Under ₹4.5 Lakhs": 450000,
  "Under ₹8.0 Lakhs": 800000,
};

// Applies the frontend's search/filter options to one database row
function matchesFilters(s, f) {
  if (f.search && f.search.trim()) {
    const q = f.search.toLowerCase().trim();
    const hit = [s.name, s.provider, s.eligibility_text].some((t) =>
      (t || "").toLowerCase().includes(q)
    );
    if (!hit) return false;
  }
  if (f.educationLevel && f.educationLevel !== "All") {
    if (s.education_level !== "All" && s.education_level !== f.educationLevel) return false;
  }
  if (f.category && f.category !== "All") {
    if (s.category !== "All" && s.category !== f.category) return false;
  }
  if (f.state && f.state !== "All") {
    const wanted = f.state === "All-India" ? "All" : f.state;
    if (s.state !== "All" && s.state !== wanted) return false;
  }
  if (f.incomeRange && f.incomeRange !== "All") {
    if (f.incomeRange === "No Income Limit") {
      if (s.max_income != null) return false;
    } else {
      const limit = INCOME_LIMITS[f.incomeRange];
      if (limit && s.max_income != null && s.max_income > limit) return false;
    }
  }
  return true;
}

// GET /api/scholarships : list (frontend shape), with optional filters and sort
async function listScholarships(req, res) {
  try {
    const f = req.query;
    const rows = await Scholarship.findAll();

    let items = rows.filter((r) => matchesFilters(r, f)).map((r) => toFrontendShape(r));

    if (f.scholarshipType && f.scholarshipType !== "All") {
      items = items.filter((m) => m.scholarshipType.includes(f.scholarshipType));
    }

    items.sort((a, b) => {
      if (f.sort === "amount") return b.amountValue - a.amountValue;
      if (f.sort === "deadline") {
        return new Date(a.deadlineDate || "2099-01-01") - new Date(b.deadlineDate || "2099-01-01");
      }
      return b.eligibilityMatch - a.eligibilityMatch;
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching scholarships" });
  }
}

// GET /api/scholarships/:id : one scholarship
async function getScholarshipById(req, res) {
  try {
    const { id } = req.params;
    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: "Invalid scholarship id" });
    }
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      return res.status(404).json({ error: "Scholarship not found" });
    }
    res.json(toFrontendShape(scholarship));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong fetching the scholarship" });
  }
}

// Shared: rules first (eligibility), then rank the rest by AI similarity
async function rankForProfile(profile) {
  const all = await Scholarship.findAll();
  const eligible = all.filter((s) => s.embedding && isEligible(s, profile));

  const profileText = `Student profile: education level ${profile.education_level}, field of study ${profile.field_of_study}, income bracket ${profile.income_bracket}, category ${profile.category}, state ${profile.state}.`;
  const profileEmbedding = await getEmbedding(profileText);

  const ranked = eligible
    .map((s) => ({
      scholarship: s,
      score: Math.round(cosineSimilarity(profileEmbedding, s.embedding) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  return { total: all.length, ranked };
}

// GET /api/scholarships/recommended : eligible scholarships with match scores (frontend shape)
async function getRecommended(req, res) {
  try {
    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Please complete your profile before matching" });
    }

    const { ranked } = await rankForProfile(profile);
    res.json(ranked.map((r) => toFrontendShape(r.scholarship, r.score)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong finding recommendations" });
  }
}

// GET /api/scholarships/matches : eligible scholarships, ranked by AI similarity (original format)
async function getMatches(req, res) {
  try {
    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Please complete your profile before matching" });
    }

    const { total, ranked } = await rankForProfile(profile);

    const matches = ranked.map(({ scholarship: s, score }) => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      eligibility_text: s.eligibility_text,
      amount: s.amount,
      deadline: s.deadline,
      link: s.link,
      score,
    }));

    res.json({ total_scholarships: total, eligible_count: matches.length, matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong finding matches" });
  }
}

module.exports = { listScholarships, getScholarshipById, getRecommended, getMatches };