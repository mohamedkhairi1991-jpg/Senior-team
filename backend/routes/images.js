import express from "express";
import multer from "multer";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.js";
import { supabase } from "../config/supabase.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const BUCKET = process.env.SUPABASE_BUCKET || "patient-images";
router.post("/:patientId", auth, upload.single("file"), async (req,res) => {
  try {
    if (!req.file) return res.status(400).json({ error:"file required (field 'file')" });
    const ext = (req.file.originalname.split(".").pop() || "bin").toLowerCase();
    const filename = `p${req.params.patientId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert:false });
    if (error) return res.status(500).json({ error:"upload failed" });
    await pool.query("INSERT INTO patient_images(patient_id, path, uploaded_by) VALUES ($1,$2,$3)",[req.params.patientId, filename, req.user.id]);
    res.status(201).json({ path: filename });
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.get("/:patientId", auth, async (req,res) => {
  try {
    const r = await pool.query("SELECT id, path, created_at FROM patient_images WHERE patient_id=$1 ORDER BY id DESC",[req.params.patientId]);
    const items = r.rows;
    const signed = await Promise.all(items.map(async it => {
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(it.path, 3600);
      return { id: it.id, url: data?.signedUrl, path: it.path, created_at: it.created_at };
    }));
    res.json(signed);
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
export default router;
