const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { essayLimiter } = require("../middleware/rateLimiter");
const {
  draftEssay,
  listMyApplications,
  updateApplication,
} = require("../controllers/essayController");

// Order matters: requireAuth first (so we know who the user is), then the limiter
router.post("/draft", requireAuth, essayLimiter, draftEssay);
router.get("/", requireAuth, listMyApplications);
router.put("/:id", requireAuth, updateApplication);

module.exports = router;