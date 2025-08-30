import express from "express";
import multer from "multer";
import { supabase } from "../config/db.js";
import crypto from "crypto";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(":patientId", upload.single("file"), async (req, res) => {
  const patient_id = req.params.patientId;
  if (!req.file) return res.status(400).json({ error: "No file" });
  const ext = (req.file.originalname.split(".").pop() || "bin").toLowerCase();
  const name = `${patient_id}/${crypto.randomUUID()}.${ext}`;
  const bucket = "patient-images";

  const { error: upErr } = await supabase.storage.from(bucket).upload(name, req.file.buffer, {
    contentType: req.file.mimetype,
    upsert: false
  });
  if (upErr) return res.status(500).json({ error: upErr.message });

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(name);
  const url = pub.publicUrl;

  const { data, error } = await supabase.from("images")
    .insert([{ patient_id, url, filename: name }]).select().single();
  if (error) return res.status(500).json({ error: error.message });

  res.json({ ...data, url });
});

export default router;