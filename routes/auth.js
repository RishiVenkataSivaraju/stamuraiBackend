const express = require("express");
const passport = require("passport");
const User = require("../Schemas/UserSchema");
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).send("User already exists");

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).send("Error registering user");
  }
});

// Login Route with Passport Authentication
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("Logged in successfully");
}); 

module.exports = router;

