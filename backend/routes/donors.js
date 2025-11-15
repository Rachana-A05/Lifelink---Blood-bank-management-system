// backend/routes/donors.js
import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donors ORDER BY donor_id");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donors WHERE donor_id = ?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { donor_id, name, blood_group, gender, contact, last_donation_date } = req.body;
    await db.query(
      "INSERT INTO donors (donor_id, name, blood_group, gender, contact, last_donation_date) VALUES (?, ?, ?, ?, ?, ?)",
      [donor_id, name, blood_group, gender, contact, last_donation_date || null]
    );
    res.json({ message: "Donor added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, blood_group, gender, contact, last_donation_date } = req.body;
    await db.query(
      "UPDATE donors SET name=?, blood_group=?, gender=?, contact=?, last_donation_date=? WHERE donor_id=?",
      [name, blood_group, gender, contact, last_donation_date || null, req.params.id]
    );
    res.json({ message: "Donor updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM donors WHERE donor_id=?", [req.params.id]);
    res.json({ message: "Donor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
