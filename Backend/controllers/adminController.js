const Resource = require("../models/Resource");
const User = require("../models/User");

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
