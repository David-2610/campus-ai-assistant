const AuditLog = require("../models/AuditLog");

// Helper to create an audit log from other controllers
exports.logAdminAction = async ({ action, description, adminId, targetId, targetModel }) => {
    try {
        await AuditLog.create({
            action,
            description,
            adminId,
            targetId,
            targetModel
        });
    } catch (err) {
        console.error("Failed to write to Audit Log:", err.message);
    }
};

// @desc    Get recent audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const logs = await AuditLog.find()
            .populate("adminId", "name email")
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching audit logs:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
