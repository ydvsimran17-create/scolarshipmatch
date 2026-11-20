const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../utils/authUtils");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup
async function signup(req, res) {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 72) {
      return res.status(400).json({ error: "Password must be between 8 and 72 characters" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const password_hash = await hashPassword(password);
    const user = await User.create({ email, password_hash });

    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during signup" });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email || !password || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during login" });
  }
}

module.exports = { signup, login };