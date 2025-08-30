import express from "express";
import { supabase } from "../config/db.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const { name, dob=null, mrn=null } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const { data, error } = await supabase.from("patients").insert([{ name, dob, mrn }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get(":id", async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

export default router;