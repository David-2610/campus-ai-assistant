const express = require("express");
const router = express.Router();

// 🔐 Middleware
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// 📦 Controllers
const {
  getPendingResources,
  approveResource,
  rejectResource,
  getAllResourcesAdmin,
  getApprovedResources,
  getRejectedResources,
  deleteResource
} = require("../controllers/resourceController");

const { getAdminStats } = require("../controllers/adminController");


// =====================================================
// 🧑‍💼 ADMIN DASHBOARD
// =====================================================

// GET /api/admin/dashboard (Legacy test)
// Access: Admin only
router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});

// GET /api/admin/stats
// Access: Admin only
router.get("/stats", protect, adminOnly, getAdminStats);


// =====================================================
// 📚 RESOURCE MODERATION (APPROVAL SYSTEM)
// =====================================================

// GET pending resources
router.get("/resources/pending", protect, adminOnly, getPendingResources);

// Approve resource
router.patch("/resources/:id/approve", protect, adminOnly, approveResource);

// Reject resource
router.patch("/resources/:id/reject", protect, adminOnly, rejectResource);


// =====================================================
// 📦 RESOURCE MANAGEMENT (ADMIN CONTROL)
// =====================================================

// Get ALL resources (admin view)
router.get("/resources", protect, adminOnly, getAllResourcesAdmin);

// Get approved resources
router.get("/resources/approved", protect, adminOnly, getApprovedResources);

// Get rejected resources
router.get("/resources/rejected", protect, adminOnly, getRejectedResources);

// Delete resource
router.delete("/resources/:id", protect, adminOnly, deleteResource);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;