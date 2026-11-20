const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { getMyProfile, upsertMyProfile } = require("../controllers/profileController");

router.get("/me", requireAuth, getMyProfile);
router.post("/me", requireAuth, upsertMyProfile);

module.exports = router;
