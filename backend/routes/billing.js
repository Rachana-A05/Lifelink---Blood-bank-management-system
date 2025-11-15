// backend/routes/billing.js
import express from "express";
import db from "../db.js";

const router = express.Router();

/* ----------------------------------------------
   ✅ GET all billing records with patient + hospital info
---------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        b.bill_id,
        b.request_id,
        b.amount,
        b.status,
        p.name AS patient_name,
        h.name AS hospital_name
      FROM billing b
      LEFT JOIN blood_requests r ON b.request_id = r.request_id
      LEFT JOIN patients p ON r.patient_id = p.patient_id
      LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
      ORDER BY b.bill_id;
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching billing data:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------
   ✅ GET single bill by ID
---------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        b.bill_id,
        b.request_id,
        b.amount,
        b.status,
        p.name AS patient_name,
        h.name AS hospital_name
      FROM billing b
      LEFT JOIN blood_requests r ON b.request_id = r.request_id
      LEFT JOIN patients p ON r.patient_id = p.patient_id
      LEFT JOIN hospitals h ON r.hospital_id = h.hospital_id
      WHERE b.bill_id = ?;
      `,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "Bill not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching single bill:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------
   ✅ ADD new bill
---------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { bill_id, request_id, amount, status } = req.body;

    if (!bill_id || !request_id || amount == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.query(
      "INSERT INTO billing (bill_id, request_id, amount, status) VALUES (?, ?, ?, ?)",
      [bill_id, request_id, amount, status || "Pending"]
    );

    res.json({ message: "✅ Bill added successfully" });
  } catch (err) {
    console.error("❌ Error adding bill:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------
   ✅ UPDATE existing bill (amount / status)
---------------------------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const { amount, status } = req.body;
    // Defensive status fallback
    const safeStatus = (typeof status === "string" && status.length) ? status : "Pending";

    // Also ensure amount is valid
    if (amount == null || isNaN(Number(amount))) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }

    const [result] = await db.query(
      "UPDATE billing SET amount = ?, status = ? WHERE bill_id = ?",
      [Number(amount), safeStatus, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Bill not found" });

    res.json({ message: "✅ Bill updated successfully" });
  } catch (err) {
    console.error("❌ Error updating bill:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ----------------------------------------------
   ✅ DELETE a bill by ID
---------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM billing WHERE bill_id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Bill not found" });

    res.json({ message: "🗑️ Bill deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting bill:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------------------------
   ✅ (Optional) Generate bill automatically 
      (if you have a stored procedure)
---------------------------------------------- */
router.post("/generate", async (req, res) => {
  try {
    const { request_id, amount } = req.body;
    const [rows] = await db.query("CALL sp_generate_bill(?, ?)", [
      request_id,
      amount,
    ]);
    res.json(rows[0] || { message: "✅ Bill generated successfully" });
  } catch (err) {
    console.error("❌ Error generating bill:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
