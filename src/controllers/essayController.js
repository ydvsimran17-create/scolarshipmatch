const Scholarship = require("../models/Scholarship");
const StudentProfile = require("../models/StudentProfile");
const Application = require("../models/Application");
const { generateText } = require("../utils/gemini");
const { isEligible } = require("../utils/eligibility");

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_STATUS = ["draft", "submitted"];

// POST /api/essays/draft
// Body: { "scholarship_id": "...", "essay_prompt": "optional essay question" }
async function draftEssay(req, res) {
  try {
    const { scholarship_id, essay_prompt } = req.body;

    if (!scholarship_id || !UUID_REGEX.test(scholarship_id)) {
      return res.status(400).json({ error: "A valid scholarship_id is required" });
    }

    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Please complete your profile first" });
    }

    const scholarship = await Scholarship.findByPk(scholarship_id);
    if (!scholarship) {
      return res.status(404).json({ error: "Scholarship not found" });
    }

    if (!isEligible(scholarship, profile)) {
      return res
        .status(403)
        .json({ error: "Based on your profile, you are not eligible for this scholarship" });
    }

    const question =
      essay_prompt ||
      "Explain why you deserve this scholarship and how it will help your education and future goals.";

    const prompt = `You are helping a student write a first draft of a scholarship essay.

Scholarship: ${scholarship.name}
Provider: ${scholarship.provider}
Eligibility: ${scholarship.eligibility_text}

Student details:
- Education level: ${profile.education_level}
- Field of study: ${profile.field_of_study}
- Income bracket: ${profile.income_bracket}
- Category: ${profile.category}
- State: ${profile.state}

Essay question: ${question}

Rules:
- Write in first person, around 250 words.
- Use ONLY the facts given above. Do not invent achievements, names, or events.
- Where a personal story or achievement would help, put a placeholder in square brackets, like [describe a challenge you overcame].
- Keep the tone sincere and clear.`;

    const draft = await generateText(prompt);

    // Save the draft: update the existing one for this scholarship, or create a new one
    let application = await Application.findOne({
      where: { student_id: profile.id, scholarship_id: scholarship.id },
    });

    if (application) {
      await application.update({ essay_prompt: question, essay_draft: draft, status: "draft" });
    } else {
      application = await Application.create({
        student_id: profile.id,
        scholarship_id: scholarship.id,
        essay_prompt: question,
        essay_draft: draft,
      });
    }

    res.json({
      application_id: application.id,
      scholarship: scholarship.name,
      draft,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate essay draft", details: err.message });
  }
}

// GET /api/essays — list the logged-in student's saved drafts
async function listMyApplications(req, res) {
  try {
    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Please complete your profile first" });
    }

    const applications = await Application.findAll({
      where: { student_id: profile.id },
      include: [{ model: Scholarship, attributes: ["id", "name", "deadline"] }],
      order: [["updatedAt", "DESC"]],
    });

    res.json({ count: applications.length, applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch your applications" });
  }
}

// PUT /api/essays/:id — edit a saved draft
// Body: { "essay_draft": "...", "status": "draft" | "submitted" }  (both optional)
async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const { essay_draft, status } = req.body;

    if (!UUID_REGEX.test(id)) {
      return res.status(400).json({ error: "Invalid application id" });
    }
    if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUS.join(", ")}` });
    }

    const profile = await StudentProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) {
      return res.status(404).json({ error: "Please complete your profile first" });
    }

    // Only the owner can edit: the application must belong to this student's profile
    const application = await Application.findOne({ where: { id, student_id: profile.id } });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const changes = {};
    if (essay_draft !== undefined) changes.essay_draft = essay_draft;
    if (status !== undefined) changes.status = status;

    await application.update(changes);
    res.json({ message: "Application updated", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update the application" });
  }
}

module.exports = { draftEssay, listMyApplications, updateApplication };