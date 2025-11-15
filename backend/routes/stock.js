import express from "express";
import db from "../db.js";
const router = express.Router();

// Get all stock with hospital info
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.blood_id, s.blood_group, s.units, s.expiry_date,
             h.hospital_id, h.name AS hospital_name
      FROM blood_stock s
      LEFT JOIN hospitals h ON s.hospital_id = h.hospital_id
      ORDER BY s.blood_id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching blood stock:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add new stock
router.post("/", async (req, res) => {
  try {
    const { blood_id, blood_group, units, expiry_date, hospital_id } = req.body;
    if (!blood_id || !blood_group || !units || !expiry_date)
      return res.status(400).json({ error: "Missing required fields" });

    await db.query(
      `INSERT INTO blood_stock (blood_id, blood_group, units, expiry_date, hospital_id)
       VALUES (?, ?, ?, ?, ?)`,
      [blood_id, blood_group, units, expiry_date, hospital_id || null]
    );

    res.json({ message: "Stock added successfully" });
  } catch (err) {
    console.error("Error adding stock:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🗑 Delete stock (by blood_id)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // REMOVE THIS LINE BELOW:
    // await db.query("DELETE FROM donation_history WHERE blood_id = ?", [id]);

    const [result] = await db.query("DELETE FROM blood_stock WHERE blood_id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Stock not found" });

    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
