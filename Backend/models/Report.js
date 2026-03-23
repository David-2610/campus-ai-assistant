const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "resolved", "dismissed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
