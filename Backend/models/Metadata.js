const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Indexes for query performance
metadataSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model("Metadata", metadataSchema);
