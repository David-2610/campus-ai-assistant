const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ["APPROVE_RESOURCE", "REJECT_RESOURCE", "DELETE_RESOURCE", "BAN_USER", "UNBAN_USER", "PROMOTE_USER", "DEMOTE_USER", "RESOLVE_REPORT"]
    },
    description: {
        type: String,
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        // Could refer to Resource, User, Report etc. depending on action
    },
    targetModel: {
        type: String,
        enum: ["Resource", "User", "Report"]
    }
}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);
