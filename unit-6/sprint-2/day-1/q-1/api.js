const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// rate limiter: 5 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later."
    });
  }
});

// public route (NO limit)
router.get("/public", (req, res) => {
  res.json({ message: "This is a public endpoint!" });
});

// limited route (WITH limit)
router.get("/limited", limiter, (req, res) => {
  res.json({ message: "You have access to this limited endpoint!" });
});

module.exports = router;
