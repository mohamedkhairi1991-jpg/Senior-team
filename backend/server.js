import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { pool } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import entryRoutes from "./routes/entries.js";
import recommendationRoutes from "./routes/recommendations.js";
import imageRoutes from "./routes/images.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("API is working ✅"));

app.use("/auth", authRoutes);
app.use("/patients", patientRoutes);
app.use("/entries", entryRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/images", imageRoutes);

async function initDb() {
  const createUsers = `
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK (role IN ('senior','resident')) DEFAULT 'resident',
      created_at TIMESTAMP DEFAULT NOW()
    );`;
  const createPatients = `
    CREATE TABLE IF NOT EXISTS patients (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      age INT,
      notes TEXT,
      created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );`;
  const createEntries = `
    CREATE TABLE IF NOT EXISTS patient_entries (
      id BIGSERIAL PRIMARY KEY,
      patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      section TEXT CHECK (section IN ('history','examination','investigation','treatment')) NOT NULL,
      content TEXT NOT NULL,
      created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_entries_patient_section ON patient_entries(patient_id, section);`;
  const createRecommendations = `
    CREATE TABLE IF NOT EXISTS recommendations (
      id BIGSERIAL PRIMARY KEY,
      patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      senior_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_rec_patient ON recommendations(patient_id);`;
  const createImages = `
    CREATE TABLE IF NOT EXISTS patient_images (
      id BIGSERIAL PRIMARY KEY,
      patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      uploaded_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_img_patient ON patient_images(patient_id);`;
  await pool.query(createUsers);
  await pool.query(createPatients);
  await pool.query(createEntries);
  await pool.query(createRecommendations);
  await pool.query(createImages);
  console.log("✅ Tables ready.");
}
initDb().catch((e) => { console.error("DB init error:", e); process.exit(1); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
