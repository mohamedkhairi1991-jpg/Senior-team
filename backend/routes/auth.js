import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req, res) => {
  const { email, password, role="resident" } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });
  try {
    const hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password_hash: hash, role }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ id: data.id, email: data.email, role: data.role });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error || !user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

export default router;