// backend/routes/hospitals.js
import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hospitals ORDER BY hospital_id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM hospitals WHERE hospital_id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { hospital_id, name, address, contact } = req.body;
    await db.query("INSERT INTO hospitals (hospital_id, name, address, contact) VALUES (?, ?, ?, ?)",
      [hospital_id, name, address, contact]);
    res.json({ message: "Hospital added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, address, contact } = req.body;
    await db.query("UPDATE hospitals SET name=?, address=?, contact=? WHERE hospital_id=?",
      [name, address, contact, req.params.id]);
    res.json({ message: "Hospital updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM hospitals WHERE hospital_id=?", [req.params.id]);
    res.json({ message: "Hospital deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
