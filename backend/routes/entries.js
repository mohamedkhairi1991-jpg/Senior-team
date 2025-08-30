import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
router.post("/:patientId", auth, async (req,res) => {
  const section = (req.query.section || "").toLowerCase();
  if (!["history","examination","investigation","treatment"].includes(section)) return res.status(400).json({ error:"invalid section" });
  const { content } = req.body; if (!content) return res.status(400).json({ error:"content required" });
  try {
    const r = await pool.query("INSERT INTO patient_entries(patient_id,section,content,created_by) VALUES ($1,$2,$3,$4) RETURNING *",[req.params.patientId,section,content,req.user.id]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.get("/:patientId", auth, async (req,res) => {
  const section = (req.query.section || "").toLowerCase();
  try {
    const q = section
      ? ["SELECT * FROM patient_entries WHERE patient_id=$1 AND section=$2 ORDER BY id DESC",[req.params.patientId, section]]
      : ["SELECT * FROM patient_entries WHERE patient_id=$1 ORDER BY id DESC",[req.params.patientId]];
    const r = await pool.query(q[0], q[1]); res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
export default router;
