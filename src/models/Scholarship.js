const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Scholarship = sequelize.define("Scholarship", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: DataTypes.STRING,
  eligibility_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  max_income: DataTypes.INTEGER,      // highest annual family income (in ₹) allowed; null = no limit
  category: DataTypes.STRING,         // e.g. "General", "SC", "ST", "Minority", or "All"
  state: DataTypes.STRING,            // e.g. "Uttar Pradesh", or "All" for nationwide
  education_level: DataTypes.STRING,  // e.g. "Undergraduate", "Postgraduate", "School", or "All"
  gender_required: {
    type: DataTypes.STRING,
    defaultValue: "All",              // "Female" for girls-only schemes, otherwise "All"
  },
  requires_disability: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,              // true if only students with disabilities can apply
  },
  amount: DataTypes.STRING,           // display text, e.g. "₹50,000/year"
  deadline: DataTypes.DATEONLY,
  link: DataTypes.STRING,
  embedding: DataTypes.JSONB,         // AI embedding (array of numbers) for this scholarship
});

module.exports = Scholarship;