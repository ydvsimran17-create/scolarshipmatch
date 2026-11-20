require("dotenv").config();
const { connectDb } = require("./config/db");
require("./models/User");
require("./models/StudentProfile");
require("./models/Scholarship");
const { sendDeadlineReminders } = require("./utils/reminders");

(async () => {
  await connectDb();
  // 90 days so it's sure to find some of your seeded scholarships
  await sendDeadlineReminders(90);
  process.exit(0);
})();