const express = require("express");
const User = require("../Schemas/UserSchema");
const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Not authenticated");
}

router.use(ensureAuth);

// GET /users → return list of registered users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "username"); // only _id and username
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
