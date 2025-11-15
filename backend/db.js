// backend/db.js
import mysql from "mysql2";

const db = mysql.createPool({
  host: "localhost",       // 🖥️ your MySQL host
  user: "root",            // 👤 your MySQL username
  password: "Rhn0510@#",            // 🔑 your MySQL password (leave empty if none)
  database: "bloodbank",   // 💾 your DB name
  port: 3306               // (optional) change if you use a custom port
});

// ✅ Export the promise-based pool
export default db.promise();
