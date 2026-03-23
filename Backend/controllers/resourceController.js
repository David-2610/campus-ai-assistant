const Resource = require("../models/Resource");
const Metadata = require("../models/Metadata");
const uploadToR2 = require("../services/r2UploadService");
const { logAdminAction } = require("./auditLogController");

// Upload Resource
exports.uploadResource = async (req, res) => {
    try {
        console.log("📥 Incoming request body:", req.body);
        console.log("📥 Incoming file:", req.file);

        const {
            title,
            type,
            subject,
            branch,
            semester,
            year,
            examType
        } = req.body;

        // --- Metadata Validation ---
        if (branch) {
            const branchValid = await Metadata.findOne({ type: "branch", value: branch, isActive: true });
            if (!branchValid) {
                return res.status(400).json({ message: "Invalid or inactive branch" });
            }
        }
        
        if (subject) {
            const subjectValid = await Metadata.findOne({ type: "subject", value: subject, isActive: true });
            if (!subjectValid) {
                return res.status(400).json({ message: "Invalid or inactive subject" });
            }
        }
        // ---------------------------

        const file = req.file;

        if (!file) {
            console.log("❌ No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // ✅ Upload to R2
        let fileUrl;
        try {
            fileUrl = await uploadToR2(file);
        } catch (err) {
            console.error("❌ Upload failed, stopping process");
            return res.status(500).json({
                message: "File upload failed",
                error: err.message
            });
        }

        const clean = (value) => value?.trim();

        const resource = await Resource.create({
            title: clean(title),
            type: clean(type),
            subject: clean(subject),
            branch: clean(branch),
            semester,
            year,
            examType: clean(examType),
            fileUrl,
            uploadedBy: req.user.id,
            status: "pending"
        });

        console.log("✅ Resource saved:", resource);

        return res.status(201).json({
            message: "Resource uploaded successfully (Pending approval)",
            resource
        });

    } catch (error) {
        console.error("🔥 Controller Error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
};

// Get Pending Resources (Admin)
exports.getPendingResources = async (req, res) => {
    try {
        const resources = await Resource.find({ status: "pending" });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Approve Resource
exports.approveResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        if (resource.status === "approved") {
            return res.status(400).json({ message: "Already approved" });
        }

        resource.status = "approved";
        await resource.save();

        await logAdminAction({
            action: "APPROVE_RESOURCE",
            description: `Approved resource "${resource.title}"`,
            adminId: req.user.id,
            targetId: resource._id,
            targetModel: "Resource"
        });

        res.json({
            message: "Resource approved",
            resource
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Reject Resource
exports.rejectResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            { status: "rejected" },
            { new: true }
        );

        await logAdminAction({
            action: "REJECT_RESOURCE",
            description: `Rejected resource "${resource ? resource.title : req.params.id}"`,
            adminId: req.user.id,
            targetId: resource ? resource._id : null,
            targetModel: "Resource"
        });

        res.json({
            message: "Resource rejected",
            resource
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Get ALL resources (Admin)
exports.getAllResourcesAdmin = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Get Approved Resources
exports.getApprovedResources = async (req, res) => {
    try {
        const resources = await Resource.find({ status: "approved" });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Get Rejected Resources
exports.getRejectedResources = async (req, res) => {
    try {
        const resources = await Resource.find({ status: "rejected" });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// Delete Resource
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        await logAdminAction({
            action: "DELETE_RESOURCE",
            description: `Deleted resource "${resource.title}"`,
            adminId: req.user.id,
            targetId: resource._id,
            targetModel: "Resource"
        });

        res.json({
            message: "Resource deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



// PUBLIC RESOURCE API (ADVANCED)
exports.getPublicResources = async (req, res) => {
    try {
      const {
        type,
        subject,
        branch,
        semester,
        year,
        examType,
        search,
        page = 1,
        limit = 10,
        sort = "latest"
      } = req.query;
  
      // Build filter object
      let filter = { status: "approved" };
  
      if (type) filter.type = type;
      if (subject) filter.subject = subject;
      if (branch) filter.branch = branch;
      if (semester) filter.semester = Number(semester);
      if (year) filter.year = Number(year);
      if (examType) filter.examType = examType;
  
      // Search (title + subject)
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } }
        ];
      }
  
      // Sorting
      let sortOption = {};
      if (sort === "latest") sortOption = { createdAt: -1 };
      if (sort === "oldest") sortOption = { createdAt: 1 };
  
      // Pagination
      const skip = (page - 1) * limit;
  
      const resources = await Resource.find(filter)
        .populate("uploadedBy", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));
  
      const total = await Resource.countDocuments(filter);
  
      res.json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        data: resources
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };