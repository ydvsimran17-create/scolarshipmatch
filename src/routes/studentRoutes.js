const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { getStudentProfile, updateStudentProfile } = require("../controllers/studentController");

router.get("/profile", requireAuth, getStudentProfile);
router.put("/profile", requireAuth, updateStudentProfile);

module.exports = router;