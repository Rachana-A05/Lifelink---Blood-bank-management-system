import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";
import "../styles/app.css";

const Stock = () => {
  const [stock, setStock] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    blood_id: "",
    blood_group: "",
    units: "",
    expiry_date: "",
    hospital_id: ""
  });

  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const [stockRes, hospRes] = await Promise.all([
          api.get("/stock"),
          api.get("/hospitals")
        ]);
        setStock(stockRes.data || []);
        setHospitals(hospRes.data || []);
      } catch (e) {
        // handle error
      }
    })();
  }, [location]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/stock", form);
      alert("Stock added successfully!");
      setForm({ blood_id: "", blood_group: "", units: "", expiry_date: "", hospital_id: "" });
      // reload stock
      const res = await api.get("/stock");
      setStock(res.data);
    } catch {
      alert("Failed to add stock");
    }
  };

  const handleDelete = async blood_id => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/stock/${blood_id}`);
      alert("Stock deleted!");
      const res = await api.get("/stock");
      setStock(res.data);
    } catch {
      alert("Failed to delete stock");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">🩸 Manage Blood Stock</h2>
      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit}
        className="card p-3 mb-4 shadow"
        style={{ maxWidth: 1200, margin: "0 auto", borderRadius: 16 }}
      >
        <div style={{ display: "flex", gap: 23, alignItems: "flex-end", flexWrap: "wrap" }}>
          {/* --- Form fields --- */}
          <div style={{ flex: 1, minWidth: 170 }}>
            <label style={{ fontWeight: 700 }} htmlFor="blood_id"></label>
            <input
              type="text"
              id="blood_id"
              name="blood_id"
              className="stock-box"
              placeholder="Blood ID"
              value={form.blood_id}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 170 }}>
            <label style={{ fontWeight: 700 }} htmlFor="blood_group"></label>
            <select
              id="blood_group"
              name="blood_group"
              className="stock-box"
              value={form.blood_group}
              onChange={handleChange}
              required
            >
              <option value="">Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg =>
                <option key={bg} value={bg}>{bg}</option>
              )}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 170 }}>
            <label style={{ fontWeight: 700 }} htmlFor="units"></label>
            <input
              type="number"
              id="units"
              name="units"
              className="stock-box"
              placeholder="Units"
              min="1"
              value={form.units}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ fontWeight: 700 }} htmlFor="expiry_date">
              Expiry Date <span style={{ fontWeight: 400 }}>(Calendar)</span>
            </label>
            <input
              type="date"
              id="expiry_date"
              name="expiry_date"
              className="stock-box"
              value={form.expiry_date}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 700 }} htmlFor="hospital_id"></label>
            <select
              id="hospital_id"
              name="hospital_id"
              className="stock-box"
              value={form.hospital_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.hospital_id} value={h.hospital_id}>
                  {h.name} ({h.hospital_id})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-danger"
            style={{
              height: 44,
              borderRadius: 10,
              minWidth: 130,
              marginBottom: 2,
              fontWeight: "bold",
              fontSize: "1.05rem",
              boxShadow: "0 2px 6px rgba(210,40,53,0.08)"
            }}
          >
            Add Stock
          </button>
        </div>
      </form>

      {/* STOCK TABLE CARD with margin-bottom for spacing */}
      <div className="card p-3 mb-4" style={{ background: "#fff", borderRadius: 16 , marginBottom: 32  }}>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Blood ID</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Expiry Date</th>
              <th>Hospital</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stock.map(item => (
              <tr key={item.blood_id}>
                <td>{item.blood_id}</td>
                <td>{item.blood_group}</td>
                <td>{item.units}</td>
                <td>{item.expiry_date && new Date(item.expiry_date).toLocaleDateString()}</td>
                <td>{item.hospital_name || item.hospital_id || "N/A"}</td>
                <td>
                  <button className="btn btn-danger btn-sm" style={{ borderRadius: 7 }}
                    onClick={() => handleDelete(item.blood_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stock.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">No stock available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
