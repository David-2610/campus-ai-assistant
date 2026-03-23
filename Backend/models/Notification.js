const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["event", "notice", "deadline"],
        required: true
    },
    targetBranch: {
        type: String,
        trim: true
    },
    targetYear: {
        type: Number
    },
    expiresAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    votesToDelete: [
        {
            adminId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Indexes for query performance
notificationSchema.index({ isActive: 1, expiresAt: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
