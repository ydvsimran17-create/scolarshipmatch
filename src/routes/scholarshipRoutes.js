const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const {
  listScholarships,
  getScholarshipById,
  getRecommended,
  getMatches,
} = require("../controllers/scholarshipController");

router.get("/", listScholarships);

// These two must come BEFORE "/:id", otherwise "recommended" is treated as an id
router.get("/recommended", requireAuth, getRecommended);
router.get("/matches", requireAuth, getMatches);

router.get("/:id", getScholarshipById);

module.exports = router;