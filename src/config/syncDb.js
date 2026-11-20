require("dotenv").config();
const { sequelize, connectDb } = require("./db");
require("../models/User");
require("../models/StudentProfile");
require("../models/Scholarship");
require("../models/Application");

(async () => {
  await connectDb();
  await sequelize.sync({ alter: true });
  console.log("[db] Models synced.");
  process.exit(0);
})();