import express from "express";
import { supabase } from "../config/db.js";

const router = express.Router();

router.post(":patientId", async (req, res) => {
  const patient_id = req.params.patientId;
  const { type, text, date=null, author=null } = req.body;
  const valid = ["history", "examination", "investigations", "treatments"];
  if (!valid.includes(type)) return res.status(400).json({ error: "invalid type" });
  const { data, error } = await supabase.from("patient_entries")
    .insert([{ patient_id, type, text, date, author }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get(":patientId", async (req, res) => {
  const patient_id = req.params.patientId;
  const { data, error } = await supabase.from("patient_entries").select("*")
    .eq("patient_id", patient_id).order("date", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;