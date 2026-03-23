const Report = require("../models/Report");
const Resource = require("../models/Resource");
const { logAdminAction } = require("./auditLogController");

// @desc    Submit a report for a resource
// @route   POST /api/resources/:id/report
// @access  Private
exports.createReport = async (req, res) => {
    try {
        const { reason } = req.body;
        const resourceId = req.params.id;

        if (!reason) {
            return res.status(400).json({ message: "A reason is required to report this resource" });
        }

        const resource = await Resource.findById(resourceId);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        // Check if user already reported this resource (pending)
        const existingReport = await Report.findOne({
            resourceId,
            reportedBy: req.user.id,
            status: "pending"
        });

        if (existingReport) {
            return res.status(400).json({ message: "You have already submitted a pending report for this resource" });
        }

        const report = await Report.create({
            resourceId,
            reportedBy: req.user.id,
            reason
        });

        res.status(201).json({ message: "Report submitted successfully. Admins will review it soon.", report });
    } catch (error) {
        console.error("Error creating report:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all reports (with populated resource and user info)
// @route   GET /api/admin/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("resourceId", "title type branch semester")
            .populate("reportedBy", "name email")
            .sort({ status: 1, createdAt: -1 }); // Pending first

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update report status (resolve/dismiss)
// @route   PATCH /api/admin/reports/:id/resolve
// @access  Private/Admin
exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!["resolved", "dismissed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        report.status = status;
        await report.save();

        await logAdminAction({
            action: "RESOLVE_REPORT",
            description: `Marked report for ${report.resourceId} as ${status}`,
            adminId: req.user.id,
            targetId: report._id,
            targetModel: "Report"
        });

        res.status(200).json({ message: `Report marked as ${status}`, report });
    } catch (error) {
        console.error("Error updating report status:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
