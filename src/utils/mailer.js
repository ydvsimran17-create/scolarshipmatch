const nodemailer = require("nodemailer");

let transporter = null;
let mode = null; // "smtp" | "ethereal" | "console"

// Picks how to send email:
// 1. Real SMTP server (e.g. Gmail) if SMTP_HOST is set in .env
// 2. Free Ethereal test inbox (needs internet access to nodemailer.com)
// 3. Console fallback: prints the email in the terminal instead of sending
async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    mode = "smtp";
    return transporter;
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    mode = "ethereal";
    console.log("[mailer] Using Ethereal test inbox.");
  } catch (err) {
    console.log("[mailer] Could not reach Ethereal (network issue). Printing emails to the terminal instead.");
    transporter = nodemailer.createTransport({ jsonTransport: true });
    mode = "console";
  }

  return transporter;
}

async function sendEmail({ to, subject, text }) {
  const mail = await getTransporter();
  const info = await mail.sendMail({
    from: process.env.MAIL_FROM || '"ScholarshipMatch" <no-reply@scholarshipmatch.test>',
    to,
    subject,
    text,
  });

  if (mode === "console") {
    console.log("\n--- EMAIL (not actually sent) ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("--- END EMAIL ---\n");
  } else if (mode === "ethereal") {
    console.log(`[mailer] Preview: ${nodemailer.getTestMessageUrl(info)}`);
  }

  return info;
}

module.exports = { sendEmail };