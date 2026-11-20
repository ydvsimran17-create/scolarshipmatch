require("dotenv").config();
const cron = require("node-cron");
const app = require("./src/app");
const { connectDb } = require("./src/config/db");
require("./src/models/User");
require("./src/models/StudentProfile");
require("./src/models/Scholarship");
require("./src/models/Application");
const { sendDeadlineReminders } = require("./src/utils/reminders");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb();

  // Runs every day at 9:00 AM (server time)
  cron.schedule("0 9 * * *", () => {
    sendDeadlineReminders(7).catch((err) =>
      console.error("[reminders] Failed:", err.message)
    );
  });

  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
    console.log("[reminders] Daily deadline check scheduled for 9:00 AM.");
  });
}

start();