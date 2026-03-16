const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});

module.exports = router;