// backend/routes/labtests.js
import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM lab_tests ORDER BY test_id");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM lab_tests WHERE test_id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const { test_id, donation_id, result, remarks } = req.body;
    await db.query("INSERT INTO lab_tests (test_id, donation_id, result, remarks) VALUES (?, ?, ?, ?)",
      [test_id, donation_id, result, remarks]);
    res.json({ message: "Lab test added" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const { result, remarks } = req.body;
    await db.query("UPDATE lab_tests SET result=?, remarks=? WHERE test_id=?", [result, remarks, req.params.id]);
    res.json({ message: "Lab test updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM lab_tests WHERE test_id=?", [req.params.id]);
    res.json({ message: "Lab test deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
