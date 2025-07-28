const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Sign Up
router.post("/signup", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const newUser = new User({
      username,
      highScore: 0,
      gamesPlayed: 0,
      totalTimePlayed: 0,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Signin failed", details: err.message });
  }
});

module.exports = router;
