const Notification = require("../models/Notification");
const Metadata = require("../models/Metadata");

// @desc    Create notification
// @route   POST /api/admin/notifications
// @access  Private/Admin|Owner
exports.createNotification = async (req, res) => {
    try {
        const { title, content, category, targetBranch, targetYear, expiresAt } = req.body;

        // Consistency check: Ensure notification categories match 'type' in metadata if applicable
        // Or ensure branch exists in metadata if provided
        if (targetBranch) {
            const branchExists = await Metadata.findOne({ type: "branch", value: targetBranch, isActive: true });
            if (!branchExists) {
                return res.status(400).json({ message: "Invalid or inactive target branch" });
            }
        }

        const notification = await Notification.create({
            title,
            content,
            category,
            targetBranch: targetBranch || undefined,
            targetYear: targetYear || undefined,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });
    } catch (error) {
        console.error("Error creating notification:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get active and non-expired notifications
// @route   GET /api/notifications
// @access  Public / Authenticated Student
exports.getNotifications = async (req, res) => {
    try {
        const now = new Date();
        
        // Filter out expired notices and inactive ones
        const filter = {
            isActive: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: now } }
            ]
        };

        // If user is provided, we might want to filter by their branch/year
        // but prompt implies just "Get all active, non-expired notifications" 
        // We'll just fetch all that match the base filter for now.
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Owner direct delete
// @route   DELETE /api/admin/notifications/:id
// @access  Private/Admin|Owner
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // According to prompt: "Owner can delete instantly"
        // Wait, if an admin is not the owner, what happens? The prompt says "delete: ['owner']" and "vote_delete: ['admin']".
        // Let's ensure the user is the owner.
        if (notification.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the owner can delete this notification directly" });
        }

        await notification.deleteOne();

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Admin vote to delete
// @route   PATCH /api/admin/notifications/:id/vote-delete
// @access  Private/Admin
exports.voteDeleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (!notification.isActive) {
            return res.status(400).json({ message: "Notification is already deactivated" });
        }

        // Check for duplicate votes
        const hasVoted = notification.votesToDelete.some(vote => vote.adminId.toString() === req.user.id);

        if (hasVoted) {
            return res.status(400).json({ message: "You have already voted to delete this notification" });
        }

        notification.votesToDelete.push({ adminId: req.user.id });

        // Admins can vote to delete; unique votes >= 2 triggers auto-deactivation
        if (notification.votesToDelete.length >= 2) {
            notification.isActive = false;
        }

        await notification.save();

        res.status(200).json({
            message: notification.isActive ? "Vote registered" : "Notification deactivated due to votes",
            notification
        });
    } catch (error) {
        console.error("Error voting to delete notification:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
