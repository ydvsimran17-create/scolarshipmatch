const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const StudentProfile = require("./StudentProfile");
const Scholarship = require("./Scholarship");

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  essay_prompt: DataTypes.TEXT, // the essay question the draft answers
  essay_draft: DataTypes.TEXT,  // the draft text (the student can edit it later)
  status: {
    type: DataTypes.ENUM("draft", "submitted"),
    defaultValue: "draft",
  },
});

// A student profile has many applications; each application belongs to one student and one scholarship
StudentProfile.hasMany(Application, { foreignKey: "student_id", onDelete: "CASCADE" });
Application.belongsTo(StudentProfile, { foreignKey: "student_id" });

Scholarship.hasMany(Application, { foreignKey: "scholarship_id", onDelete: "CASCADE" });
Application.belongsTo(Scholarship, { foreignKey: "scholarship_id" });

module.exports = Application;