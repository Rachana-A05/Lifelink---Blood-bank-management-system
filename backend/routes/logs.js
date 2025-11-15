import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Billing Logs
router.get("/billing_logs", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        bill_id, 
        action, 
        logged_at
      FROM billing_logs
      ORDER BY logged_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching billing logs:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Donation Logs (fixed ORDER BY)
router.get("/donation_logs", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        log_id, 
        donor_id, 
        blood_group, 
        message, 
        logged_at
      FROM donation_logs
      ORDER BY logged_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching donation logs:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Stock Alerts
router.get("/stock_alerts", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        blood_id,
        blood_group,
        units,
        expiry_date,
        hospital_id
      FROM blood_stock
      WHERE units < 5
      ORDER BY expiry_date ASC
      LIMIT 20
    `);
    // Optionally compose a message field for frontend convenience
    const alerts = rows.map(row => ({
      blood_group: row.blood_group,
      message: `Low stock: ${row.units} units remaining (expires: ${row.expiry_date})`,
      ...row
    }));
    res.json(alerts);
  } catch (err) {
    console.error("Error fetching stock alerts:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
