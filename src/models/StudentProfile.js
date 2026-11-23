const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const StudentProfile = sequelize.define("StudentProfile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  education_level: DataTypes.STRING,
  field_of_study: DataTypes.STRING,
  income_bracket: DataTypes.STRING,
  family_income: DataTypes.INTEGER, // annual family income in rupees, e.g. 180000
  category: DataTypes.STRING,
  state: DataTypes.STRING,
  gender: DataTypes.STRING, // "Female", "Male" or "Other"
  has_disability: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  details: DataTypes.JSONB, // the full profile exactly as the frontend form stores it
});

// A user has one student profile; a profile belongs to one user
User.hasOne(StudentProfile, { foreignKey: "user_id", onDelete: "CASCADE" });
StudentProfile.belongsTo(User, { foreignKey: "user_id" });

module.exports = StudentProfile;