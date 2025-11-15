import express from "express";
import db from "../db.js";
const router = express.Router();

// Get all requests; patients join
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.request_id, r.patient_id, p.name AS patient_name, r.hospital_id, h.name AS hospital_name, r.blood_group, r.units_requested, r.status
        FROM blood_requests r
        LEFT JOIN patients p ON r.patient_id = p.patient_id
        LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
        ORDER BY r.request_id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single patient detail
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

// Add a new request
router.post("/", async (req, res) => {
  try {
    const { request_id, patient_id, blood_group, units_requested, status, hospital_id } = req.body;
    await db.query(
      "INSERT INTO blood_requests (request_id, patient_id, blood_group, units_requested, status, hospital_id) VALUES (?, ?, ?, ?, ?, ?)",
      [request_id, patient_id, blood_group, units_requested, status || "Pending", hospital_id]
    );
    res.json({ message: "Request created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject (status update)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    // must be exactly as your table columns!
    await db.query(
      "UPDATE blood_requests SET status = ? WHERE request_id = ?",
      [status, req.params.id]
    );
    res.json({ message: "Request status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
