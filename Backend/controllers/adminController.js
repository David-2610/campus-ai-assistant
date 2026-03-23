const Resource = require("../models/Resource");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Get dashboard statistics for admin panel
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const totalResources = await Resource.countDocuments();
        const pendingResources = await Resource.countDocuments({ status: "pending" });
        const approvedResources = await Resource.countDocuments({ status: "approved" });
        const rejectedResources = await Resource.countDocuments({ status: "rejected" });
        
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            totalResources,
            pendingResources,
            approvedResources,
            rejectedResources,
            totalUsers
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get dashboard advanced analytics (Charts)
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAdminAnalytics = async (req, res) => {
    try {
        // Resources by Branch
        const resourcesByBranch = await Resource.aggregate([
            { $group: { _id: "$branch", count: { $sum: 1 } } },
            { $project: { name: { $ifNull: ["$_id", "Unknown"] }, value: "$count", _id: 0 } }
        ]);

        // Resources by Type
        const resourcesByType = await Resource.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $project: { name: { $ifNull: ["$_id", "Unknown"] }, value: "$count", _id: 0 } }
        ]);

        // Top Notices
        const topNotices = await Notification.find({ isActive: true })
            .sort({ views: -1 })
            .limit(5)
            .select("title views category");

        res.status(200).json({ resourcesByBranch, resourcesByType, topNotices });
    } catch (error) {
        console.error("Error fetching analytics:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
