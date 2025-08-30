import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase, pingSupabase } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import entryRoutes from "./routes/entries.js";
import recommendationRoutes from "./routes/recommendations.js";
import imageRoutes from "./routes/images.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/", (_req, res) => res.send("✅ Backend is running!"));
app.get("/health/db", async (_req, res) => {
  try {
    const result = await pingSupabase();
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// API
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
