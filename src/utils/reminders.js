const { Op } = require("sequelize");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Scholarship = require("../models/Scholarship");
const { isEligible } = require("./eligibility");
const { sendEmail } = require("./mailer");

// Emails each student ONLY the upcoming deadlines (within `days` days) they are eligible for
async function sendDeadlineReminders(days = 7) {
  const today = new Date();
  const start = today.toISOString().slice(0, 10); // e.g. "2026-11-02"
  const end = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const upcoming = await Scholarship.findAll({
    where: { deadline: { [Op.between]: [start, end] } },
    order: [["deadline", "ASC"]],
  });

  if (upcoming.length === 0) {
    console.log(`[reminders] No scholarship deadlines in the next ${days} days.`);
    return 0;
  }

  const profiles = await StudentProfile.findAll({ include: [{ model: User }] });
  const totalStudents = await User.count({ where: { role: "student" } });

  let sent = 0;
  let noMatches = 0;

  for (const profile of profiles) {
    const mine = upcoming.filter((s) => isEligible(s, profile));

    if (mine.length === 0) {
      noMatches++;
      continue;
    }

    const lines = mine
      .map((s) => `- ${s.name} (deadline: ${s.deadline}) ${s.link || ""}`)
      .join("\n");

    await sendEmail({
      to: profile.User.email,
      subject: `Reminder: ${mine.length} scholarship deadline(s) you're eligible for`,
      text: `Hi,\n\nThese scholarships you're eligible for close within the next ${days} days:\n\n${lines}\n\nDon't miss out - apply before the deadline!\n\n- ScholarshipMatch`,
    });
    sent++;
  }

  const withoutProfile = totalStudents - profiles.length;
  console.log(
    `[reminders] Sent ${sent} email(s). ${noMatches} student(s) had no eligible deadlines. ${withoutProfile} student(s) skipped (no profile yet).`
  );
  return sent;
}

module.exports = { sendDeadlineReminders };