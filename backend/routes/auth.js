import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
const router = express.Router();
router.post("/register", async (req, res) => {
  try {
    const { email, password, role="resident" } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    if (!["senior","resident"].includes(role)) return res.status(400).json({ error: "invalid role" });
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query("INSERT INTO users(email,password_hash,role) VALUES ($1,$2,$3) RETURNING id,email,role,created_at",[email,hash,role]);
    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Email already exists" });
    console.error(e); res.status(500).json({ error: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  try {
    const r = await pool.query("SELECT id,email,role,password_hash FROM users WHERE email=$1",[email]);
    if (r.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });
    const u = r.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id:u.id, email:u.email, role:u.role }, process.env.JWT_SECRET, { expiresIn:"7d" });
    res.json({ token, user: { id:u.id, email:u.email, role:u.role } });
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
export default router;
