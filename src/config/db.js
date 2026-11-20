const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log("[db] PostgreSQL connection established.");
  } catch (err) {
    console.error("[db] Unable to connect:", err.message);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDb };