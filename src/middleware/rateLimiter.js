const { rateLimit } = require("express-rate-limit");

// Essay drafts call the AI (free quota), so limit them per logged-in user.
// Must be placed AFTER requireAuth so req.user exists.
const essayLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5,                 // 5 drafts per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
  message: { error: "Too many essay drafts. Please wait a few minutes and try again." },
});

// Login/signup: slow down password guessing (limited per IP address)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,                // 20 attempts per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in a few minutes." },
});

module.exports = { essayLimiter, authLimiter };