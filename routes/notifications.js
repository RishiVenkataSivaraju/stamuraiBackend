const express = require("express");
const Notification = require("../Schemas/NotificationSchema");
const router = express.Router();

// ✅ Ensure user is logged in
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Not authenticated");
}

router.use(ensureAuth);

// 🔁 Mark a specific notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },  // ✅ 'recipient' instead of 'user'
      { isRead: true },                                  // ✅ 'isRead' instead of 'read'
      { new: true }
    );

    if (!notif) return res.status(404).send("Notification not found");

    res.json(notif);
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
    res.status(500).json({ error: err.message });        // ✅ fixed 'err. Message' typo
  }
});


// 🔔 Get all unread notifications for current user
// router.get("/", async (req, res) => {
//   try {
//     const notifs = await Notification.find({ user: req.user._id, read: false })
//       .sort({ createdAt: -1 })
//       .populate("task", "title");
//     res.json(notifs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// 📢 Get all notifications (read + unread)
router.get("/all", async (req, res) => {
  try {
    const notifs = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("taskId", "title")
      .populate("sender", "username"); // <-- Important
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/unread", async (req, res) => {
  try {
    const notifs = await Notification.find({
      recipient: req.user._id,  // only notifications for logged-in user
      isRead: false             // and only unread ones
    })
      .sort({ createdAt: -1 })
      .populate("taskId", "title")
      .populate("sender", "username");  // assuming taskId is the correct field

    res.json(notifs);
  } catch (err) {
    console.error("❌ Error fetching unread notifications:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Mark all notifications as read
router.put("/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.send("All notifications marked as read");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


