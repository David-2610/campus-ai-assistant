const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  type: String,
  subjectId: mongoose.Schema.Types.ObjectId,
  branch: String,
  semester: Number,
  year: Number,
  examType: String,
  fileUrl: String,
  uploadedBy: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Resource", resourceSchema);
