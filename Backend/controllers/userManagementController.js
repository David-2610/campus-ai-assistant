const User = require("../models/User");
const { logAdminAction } = require("./auditLogController");

// @desc    Get all users with optional filtering
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const { branch, graduationYear, role } = req.query;
        let query = {};
        
        if (branch) query.branch = branch;
        if (graduationYear) query.graduationYear = parseInt(graduationYear);
        if (role) query.role = role;

        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update user role (promote/demote)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['student', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent admin from demoting themselves (failsafe)
        if (user._id.toString() === req.user.id && role !== 'admin') {
            return res.status(400).json({ message: "You cannot demote yourself" });
        }

        user.role = role;
        await user.save();

        await logAdminAction({
            action: role === 'admin' ? "PROMOTE_USER" : "DEMOTE_USER",
            description: `Updated ${user.email} to ${role}`,
            adminId: req.user.id,
            targetId: user._id,
            targetModel: "User"
        });

        res.status(200).json({ message: `User role updated to ${role}`, user: { _id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        console.error("Error updating user role:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Ban or unban user (toggle isActive)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        
        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: "isActive must be a boolean" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: "You cannot suspend your own account" });
        }

        user.isActive = isActive;
        await user.save();

        await logAdminAction({
            action: isActive ? "UNBAN_USER" : "BAN_USER",
            description: `${isActive ? 'Unbanned' : 'Suspended'} user ${user.email}`,
            adminId: req.user.id,
            targetId: user._id,
            targetModel: "User"
        });

        res.status(200).json({ message: `User account ${isActive ? 'activated' : 'suspended'}`, user: { _id: user._id, isActive: user.isActive }});
    } catch (error) {
        console.error("Error toggling user status:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
