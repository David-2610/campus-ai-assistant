const Metadata = require("../models/Metadata");

// @desc    Add single metadata entry
// @route   POST /api/admin/metadata
// @access  Private/Admin
exports.createMetadata = async (req, res) => {
    try {
        const { type, value, priority, isActive } = req.body;

        if (!type || !value) {
            return res.status(400).json({ message: "Type and value are required" });
        }

        const metadata = await Metadata.create({
            type,
            value,
            priority: priority || 0,
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Metadata created successfully",
            metadata
        });
    } catch (error) {
        console.error("Error creating metadata:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Add multiple metadata entries in one request
// @route   POST /api/admin/metadata/bulk
// @access  Private/Admin
exports.createBulkMetadata = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "An array of metadata items is required" });
        }

        const bulkData = items.map(item => ({
            type: item.type,
            value: item.value,
            priority: item.priority || 0,
            isActive: item.isActive !== undefined ? item.isActive : true,
            createdBy: req.user.id
        }));

        const insertedMetadata = await Metadata.insertMany(bulkData);

        res.status(201).json({
            message: `${insertedMetadata.length} metadata items added successfully`,
            metadata: insertedMetadata
        });
    } catch (error) {
        console.error("Error creating bulk metadata:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Fetch active metadata grouped by type, sorted by priority (desc) then value (asc)
// @route   GET /api/metadata
// @access  Public
exports.getMetadata = async (req, res) => {
    try {
        const metadataList = await Metadata.find({ isActive: true })
            .sort({ priority: -1, value: 1 })
            .select("type value priority -_id"); // Excluding _id if needed, but maybe keep it. Let's keep _id.

        // Actually the prompt says: Fetch active metadata grouped by type, sorted by priority then value
        // Let's refetch with _id
        const fullMetadataList = await Metadata.find({ isActive: true })
            .sort({ priority: -1, value: 1 });

        // Group by type
        const groupedMetadata = fullMetadataList.reduce((acc, curr) => {
            if (!acc[curr.type]) {
                acc[curr.type] = [];
            }
            acc[curr.type].push(curr);
            return acc;
        }, {});

        res.status(200).json(groupedMetadata);
    } catch (error) {
        console.error("Error fetching metadata:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update value, priority, or deactivate
// @route   PATCH /api/admin/metadata/:id
// @access  Private/Admin
exports.updateMetadata = async (req, res) => {
    try {
        const { value, priority, isActive } = req.body;

        const metadata = await Metadata.findById(req.params.id);

        if (!metadata) {
            return res.status(404).json({ message: "Metadata not found" });
        }

        if (value !== undefined) metadata.value = value;
        if (priority !== undefined) metadata.priority = priority;
        if (isActive !== undefined) metadata.isActive = isActive;

        await metadata.save();

        res.status(200).json({
            message: "Metadata updated successfully",
            metadata
        });
    } catch (error) {
        console.error("Error updating metadata:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Delete metadata entry
// @route   DELETE /api/admin/metadata/:id
// @access  Private/Admin
exports.deleteMetadata = async (req, res) => {
    try {
        const metadata = await Metadata.findByIdAndDelete(req.params.id);

        if (!metadata) {
            return res.status(404).json({ message: "Metadata not found" });
        }

        res.status(200).json({ message: "Metadata deleted successfully" });
    } catch (error) {
        console.error("Error deleting metadata:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
