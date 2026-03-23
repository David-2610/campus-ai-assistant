const multer = require("multer");
const os = require("os");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Vercel serverless apps throw 500 when writing to 'uploads/'. Must use /tmp via OS temp dir.
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.]/g, ""));
  }
});

const upload = multer({
  storage
});

module.exports = upload;