const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/signup", authLimiter, signup);
router.post("/register", authLimiter, signup); // same as signup (the frontend uses this name)
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getMe);

// Tokens are stateless, so logging out just means the frontend deletes its token
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

module.exports = router;