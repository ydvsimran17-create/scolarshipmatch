const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { listScholarships, getMatches } = require("../controllers/scholarshipController");

router.get("/", listScholarships);
router.get("/matches", requireAuth, getMatches);

module.exports = router;