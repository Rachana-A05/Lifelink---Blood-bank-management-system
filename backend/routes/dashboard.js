// backend/routes/dashboard.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [[donors]] = await db.query("SELECT COUNT(*) AS total_donors FROM donors");
    const [[patients]] = await db.query("SELECT COUNT(*) AS total_patients FROM patients");
    const [[requests]] = await db.query("SELECT COUNT(*) AS active_requests FROM blood_requests WHERE status IN ('Pending','Approved')");
    const [[stock]] = await db.query("SELECT SUM(units_available) AS total_units FROM stock");

    res.json({
      total_donors: donors.total_donors || 0,
      total_patients: patients.total_patients || 0,
      active_requests: requests.active_requests || 0,
      total_units: stock.total_units || 0,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: "Server error fetching dashboard" });
  }
});

export default router;
