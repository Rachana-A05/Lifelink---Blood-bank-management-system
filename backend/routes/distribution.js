import express from "express";
import db from "../db.js";

const router = express.Router();

const BLOOD_PRICES = {
  "A+": 200, "A-": 250, "B+": 200, "B-": 250,
  "AB+": 300, "AB-": 350, "O+": 150, "O-": 400
};

router.get("/patient/:id", async (req, res) => {
  const patientId = req.params.id;
  try {
    const [rows] = await db.query(
      `SELECT r.request_id, r.patient_id, r.units_requested, r.blood_group, r.status, r.hospital_id,
              h.name AS hospital_name, p.name AS patient_name
         FROM blood_requests r
    LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
    LEFT JOIN patients p ON r.patient_id = p.patient_id
        WHERE r.patient_id = ? AND r.status IN ('Approved','Pending')
        ORDER BY r.request_id DESC LIMIT 1`, [patientId]);
    if (!rows.length)
      return res.json({ ok: true, request: null });
    return res.json({ ok: true, request: rows[0] });
  } catch (err) {
    console.error("Error in GET /distribution/patient/:id", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// FIXED: uses blood_stock, blood_id, units
router.get("/stock/:blood_group", async (req, res) => {
  const bg = req.params.blood_group;
  try {
    const [rows] = await db.query(
      `SELECT blood_id AS stock_id, blood_group, units AS units_available, expiry_date, hospital_id
       FROM blood_stock WHERE blood_group = ? AND units > 0
       ORDER BY expiry_date ASC`, [bg]);
    res.json({ ok: true, stock: rows });
  } catch (err) {
    console.error("Error in GET /distribution/stock/:blood_group", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// FIXED: uses blood_stock, blood_id, units
router.post("/", async (req, res) => {
  const { stock_id, patient_id, hospital_id, units_assigned } = req.body;
  if (!stock_id || !patient_id || !hospital_id || !units_assigned)
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  const units = parseInt(units_assigned, 10);
  if (isNaN(units) || units <= 0)
    return res.status(400).json({ ok: false, error: "Invalid units_assigned" });

  try {
    const [stockRows] = await db.query(
      "SELECT units FROM blood_stock WHERE blood_id = ?", [stock_id]);
    if (!stockRows.length)
      return res.status(404).json({ ok: false, error: "Stock not found" });
    const available = Number(stockRows[0].units || 0);
    if (available < units)
      return res.status(400).json({ ok: false, error: "Not enough units available" });

    await db.query("UPDATE blood_stock SET units = units - ? WHERE blood_id = ?", [units, stock_id]);
    await db.query(
      "INSERT INTO stock_distribution (stock_id, patient_id, hospital_id, units_assigned) VALUES (?, ?, ?, ?)",
      [stock_id, patient_id, hospital_id, units]);
    await db.query(
      "UPDATE blood_requests SET status = 'Completed' WHERE patient_id = ? AND status IN ('Approved','Pending')",
      [patient_id]);

    res.json({ ok: true, message: "Blood distributed successfully" });

    // --- BILLING LOGIC (robust, safe) ---
    try {
      const [patientRows] = await db.query(
        "SELECT blood_group, request_id FROM blood_requests WHERE patient_id = ? ORDER BY request_id DESC LIMIT 1",
        [patient_id]
      );
      const bloodGroup = patientRows[0]?.blood_group || '';
      const requestId = patientRows[0]?.request_id || '';
      const pricePerUnit = BLOOD_PRICES[bloodGroup] || 0;
      const amount = units * pricePerUnit;
      const billId = "B" + Date.now();

      await db.query(
        "INSERT INTO billing (bill_id, request_id, amount, status) VALUES (?, ?, ?, 'Pending')",
        [billId, requestId, amount]
      );
      await db.query(
        "INSERT INTO billing_logs (bill_id, action) VALUES (?, ?)",
        [billId, `Bill created automatically for patient ${patient_id}`]
      );
    } catch (secondaryErr) {
      console.error("Billing/logging error (not blocking):", secondaryErr);
    }
  } catch (err) {
    console.error("Error in POST /distribution", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
