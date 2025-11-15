import express from "express";
import db from "../db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT patient_id, name, gender, blood_group, contact, hospital_id FROM patients ORDER BY patient_id"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching patients" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT patient_id, name, gender, blood_group, contact, hospital_id FROM patients WHERE patient_id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching patient", detail: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { patient_id, name, gender, blood_group, contact, hospital_id } = req.body;
    await db.query(
      "INSERT INTO patients (patient_id, name, gender, blood_group, contact, hospital_id) VALUES (?, ?, ?, ?, ?, ?)",
      [patient_id, name, gender, blood_group, contact, hospital_id]
    );
    res.json({ message: "Patient added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, gender, blood_group, contact, hospital_id } = req.body;
    await db.query(
      "UPDATE patients SET name=?, gender=?, blood_group=?, contact=?, hospital_id=? WHERE patient_id=?",
      [name, gender, blood_group, contact, hospital_id, req.params.id]
    );
    res.json({ message: "Patient updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM patients WHERE patient_id=?", [req.params.id]);
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
