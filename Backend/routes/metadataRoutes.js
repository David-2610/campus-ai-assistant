const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    createMetadata,
    createBulkMetadata,
    getMetadata,
    updateMetadata,
    deleteMetadata
} = require("../controllers/metadataController");

// PUBLIC ROUTES (No auth required according to prompt implied by 'Fetch active metadata')
// We will mount this on /api in server.js so the path here is just /metadata
// Actually the prompt says GET /api/metadata, and POST /api/admin/metadata
// I will separate these or handle them carefully. I'll define them based on how they will be attached in server.js.

// We can export a single router and mount it differently, OR handle the paths in server.js
// Let's create handlers for both paths here, and server.js will mount this router on /api
// So routes here will be /admin/metadata and /metadata

// Public
router.get("/metadata", getMetadata);

// Admin
router.post("/admin/metadata", protect, adminOnly, createMetadata);
router.post("/admin/metadata/bulk", protect, adminOnly, createBulkMetadata);
router.patch("/admin/metadata/:id", protect, adminOnly, updateMetadata);
router.delete("/admin/metadata/:id", protect, adminOnly, deleteMetadata);

module.exports = router;
