import express from "express";
import { pool } from "../config/db.js";
import { auth, requireSenior } from "../middleware/auth.js";
const router = express.Router();
router.post("/:patientId", auth, requireSenior, async (req,res) => {
  const { content } = req.body; if (!content) return res.status(400).json({ error:"content required" });
  try {
    const r = await pool.query("INSERT INTO recommendations(patient_id, senior_id, content) VALUES ($1,$2,$3) RETURNING *",[req.params.patientId, req.user.id, content]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.get("/:patientId", auth, async (req,res) => {
  try { const r = await pool.query("SELECT * FROM recommendations WHERE patient_id=$1 ORDER BY id DESC",[req.params.patientId]); res.json(r.rows); }
  catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
export default router;
