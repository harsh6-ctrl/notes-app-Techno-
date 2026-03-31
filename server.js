require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
const authRoutes = require("./routes/auth");
const subjectsRoutes = require("./routes/subjects");
const progressRoutes = require("./routes/progress");
const authMiddleware = require("./middleware/auth");

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectsRoutes);                    // ← authMiddleware removed
app.use("/api/progress", authMiddleware, progressRoutes);    // ← authMiddleware kept

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR 👉", err);
  res.status(500).json({
    message: err.message,
    name: err.name,
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
