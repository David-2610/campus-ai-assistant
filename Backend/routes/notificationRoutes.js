const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    createNotification,
    getNotifications,
    deleteNotification,
    voteDeleteNotification,
    incrementView
} = require("../controllers/notificationController");

// Public (Or basic student access - protect middleware can be applied if needed based on base app logic, we will assume public/protected is handled appropriately)
// Let's add protect so that "students have read-only access"
router.get("/notifications", protect, getNotifications);
router.patch("/notifications/:id/view", protect, incrementView);

// Admin / Owner
router.post("/admin/notifications", protect, adminOnly, createNotification);
router.delete("/admin/notifications/:id", protect, adminOnly, deleteNotification);
router.patch("/admin/notifications/:id/vote-delete", protect, adminOnly, voteDeleteNotification);

module.exports = router;
