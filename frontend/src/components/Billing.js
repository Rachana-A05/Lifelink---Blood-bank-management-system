import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";

const BLOOD_PRICES = {
  "A+": 200,
  "A-": 250,
  "B+": 200,
  "B-": 250,
  "AB+": 300,
  "AB-": 350,
  "O+": 150,
  "O-": 400
};
function calculateBill(bloodGroup, units) {
  const pricePerUnit = BLOOD_PRICES[bloodGroup] || 0;
  return Number(units) * Number(pricePerUnit);
}

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { patient, request } = location.state || {};
  // Make billValue editable on the Billing screen
  const [billValue, setBillValue] = useState(request?.bill_amount ?? 0);

  // Load billing data on mount
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/billing");
        if (!active) return;
        setBills(res.data || []);
      } catch (e) {
        console.error("Error fetching billing:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function refresh() {
    try {
      const res = await api.get("/billing");
      setBills(res.data || []);
    } catch (e) { console.error(e); }
  }

  async function editBill(bill) {
    try {
      const newAmountStr = window.prompt("Enter new amount:", String(bill.amount ?? 0));
      if (newAmountStr === null) return;
      const newAmount = Number(newAmountStr);
      if (Number.isNaN(newAmount)) {
        alert("Invalid amount entered");
        return;
      }
      const status = window.prompt("Enter status (Paid / Pending / Not Paid):", bill.status || "Pending");
      if (status === null) return;
      await api.put(`/billing/${bill.bill_id}`, { amount: newAmount, status });
      alert("Bill updated successfully!");
      await refresh();
    } catch (e) {
      console.error("Error editing bill:", e);
      alert("❌ Failed to update bill.");
    }
  }

  if (loading) return <p>Loading billing data...</p>;

  return (
    <div>
      <h2>💰 Billing</h2>
      {(patient || request) && (
        <div className="card p-3 mb-4">
          <h5>Latest Distribution Details</h5>
          {patient && (
            <div>
              <b>Patient:</b> {patient.patient_name || patient.name} ({patient.patient_id})
            </div>
          )}
          {request && (
            <div>
              <b>Request ID:</b> {request.request_id} <br />
              <b>Blood Group:</b> {request.blood_group} <br />
              <b>Units Assigned:</b> {request.units_assigned || request.units_requested} <br />
              <b>Amount (editable):</b>
              <input
                type="number"
                value={billValue}
                min="0"
                onChange={e => setBillValue(Number(e.target.value))}
                style={{ width: "120px", marginLeft: "10px" }}
              />
              <span className="ms-2 text-secondary">
                (Default: {calculateBill(request.blood_group, request.units_assigned)})
              </span>
              {/* Optionally add a save/update button if you want to persist */}
            </div>
          )}
        </div>
      )}
      <div className="table-wrap">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Bill ID</th>
              <th>Request</th>
              <th>Patient Name</th>
              <th>Hospital</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No bills available.
                </td>
              </tr>
            ) : (
              bills.map((b) => (
                <tr key={b.bill_id}>
                  <td>{b.bill_id}</td>
                  <td>{b.request_id}</td>
                  <td>{b.patient_name || "N/A"}</td>
                  <td>{b.hospital_name || "N/A"}</td>
                  <td>{b.amount}</td>
                  <td>{b.status}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => editBill(b)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
