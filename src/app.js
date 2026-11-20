const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profiles", require("./routes/profileRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/essays", require("./routes/essayRoutes"));
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "scholarshipmatch-backend" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

module.exports = app;