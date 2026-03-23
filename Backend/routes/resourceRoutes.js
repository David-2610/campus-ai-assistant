const express = require("express");
const router = express.Router();

const { uploadResource } = require("../controllers/resourceController");
const { getPublicResources } = require("../controllers/resourceController");

// Public route (no auth)

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { createReport } = require("../controllers/reportController");

router.get("/", getPublicResources);
router.post("/upload", protect, upload.single("file"), uploadResource);
router.post("/:id/report", protect, createReport);

module.exports = router;