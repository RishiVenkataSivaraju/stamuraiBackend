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
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    // You can use a session or JWT here; for now just send success
    res.status(200).json({ message: "Logged in successfully", user: { username: user.username, id: user._id } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});


module.exports = router;

