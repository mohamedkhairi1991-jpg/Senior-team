import express from "express";
import { pool } from "../config/db.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
router.post("/", auth, async (req, res) => {
  try {
    const { name, age, notes } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const r = await pool.query("INSERT INTO patients(name,age,notes,created_by) VALUES ($1,$2,$3,$4) RETURNING *",[name,age ?? null,notes ?? null,req.user.id]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.get("/", auth, async (_req, res) => {
  try { const r = await pool.query("SELECT * FROM patients ORDER BY id DESC"); res.json(r.rows); }
  catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.get("/:id", auth, async (req, res) => {
  try { const r = await pool.query("SELECT * FROM patients WHERE id=$1",[req.params.id]);
    if (r.rowCount===0) return res.status(404).json({error:"Not found"}); res.json(r.rows[0]); }
  catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, age, notes } = req.body;
    const r = await pool.query("UPDATE patients SET name=COALESCE($1,name), age=COALESCE($2,age), notes=COALESCE($3,notes) WHERE id=$4 RETURNING *",[name ?? null, age ?? null, notes ?? null, req.params.id]);
    if (r.rowCount===0) return res.status(404).json({error:"Not found"}); res.json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
router.delete("/:id", auth, async (req, res) => {
  try { const r = await pool.query("DELETE FROM patients WHERE id=$1 RETURNING id",[req.params.id]);
    if (r.rowCount===0) return res.status(404).json({error:"Not found"}); res.json({deleted:r.rows[0].id}); }
  catch (e) { console.error(e); res.status(500).json({ error:"Server error" }); }
});
export default router;
