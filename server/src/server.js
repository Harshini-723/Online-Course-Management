
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import enrollmentRoutes from "./routes/enrollments.js";
import adminRoutes from "./routes/admin.js";
import Course from "./models/Course.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || true
  })
);

app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "LearnHub API"
  });
});

// Temporary database diagnostic
app.get("/api/debug/courses", async (_req, res) => {
  try {
    const total = await Course.countDocuments();
    const published = await Course.countDocuments({
      published: true
    });

    res.json({
      totalCourses: total,
      publishedCourses: published
    });
  } catch (error) {
    console.error("Course diagnostic error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Server error"
  });
});

// Start server after MongoDB connection
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log(`LearnHub API listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
