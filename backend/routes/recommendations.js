import express from "express";
import { supabase } from "../config/db.js";

const router = express.Router();

router.post(":patientId", async (req, res) => {
  const patient_id = req.params.patientId;
  const { text, author="senior" } = req.body;
  const { data, error } = await supabase.from("recommendations")
    .insert([{ patient_id, text, author }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get(":patientId", async (req, res) => {
  const patient_id = req.params.patientId;
  const { data, error } = await supabase.from("recommendations").select("*")
    .eq("patient_id", patient_id).order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;