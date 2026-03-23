require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const metadataRoutes = require("./routes/metadataRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", metadataRoutes);
app.use("/api", notificationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Campus AI Assistant API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});