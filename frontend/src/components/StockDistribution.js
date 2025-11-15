import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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

export default function StockDistribution() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [matchingStock, setMatchingStock] = useState([]);
  const [unitsToAssign, setUnitsToAssign] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchPatients(); }, []);

  async function fetchPatients() {
    try {
      const res = await api.get("/patients");
      if (res?.data) setPatients(res.data);
    } catch {
      setInfoMessage("Failed to load patients. Check server.");
    }
  }

  async function fetchStock(bloodGroup) {
    try {
      const stockRes = await api.get(`/distribution/stock/${bloodGroup}`);
      if (stockRes?.data?.ok) setMatchingStock(stockRes.data.stock || []);
    } catch {
      setInfoMessage("Failed to refresh stock for blood group.");
    }
  }

  async function handlePatientSelect(patientId) {
    setInfoMessage("");
    setSelectedPatient(null);
    setMatchingStock([]);
    setSelectedStock(null);
    setUnitsToAssign("");
    if (!patientId) return;
    try {
      const res = await api.get(`/distribution/patient/${patientId}`);
      if (!res?.data?.ok) {
        setInfoMessage(res.data?.error || "No pending/approved request found.");
        return;
      }
      const request = res.data.request;
      if (!request) {
        setInfoMessage("No pending/approved request found for this patient.");
        return;
      }
      setSelectedPatient(request);
      const stockRes = await api.get(`/distribution/stock/${request.blood_group}`);
      if (stockRes?.data?.ok) {
        setMatchingStock(stockRes.data.stock || []);
        if (!stockRes.data.stock?.length) setInfoMessage("No stock available for required blood group.");
      } else setInfoMessage("Failed to fetch matching stock.");
    } catch {
      setInfoMessage("Failed to fetch patient info.");
    }
  }

  function handleStockSelect(stockId) {
    if (!stockId) return setSelectedStock(null);
    setSelectedStock(matchingStock.find(x => String(x.stock_id) === String(stockId)) || null);
  }

  async function handleDistribute(e) {
    e.preventDefault();
    setInfoMessage("");
    if (!selectedPatient) { setInfoMessage("Select a patient first."); return; }
    if (!selectedStock) { setInfoMessage("Select stock to distribute from."); return; }
    if (!unitsToAssign || Number(unitsToAssign) <= 0) {
      setInfoMessage("Enter a positive number of units to assign."); return;
    }
    try {
      const payload = {
        stock_id: selectedStock.stock_id,
        patient_id: selectedPatient.patient_id,
        hospital_id: selectedPatient.hospital_id,
        units_assigned: Number(unitsToAssign)
      };
      const res = await api.post("/distribution", payload);
      if (res.data && res.data.ok) {
        await fetchStock(selectedPatient.blood_group);
        const unitsAssigned = Number(unitsToAssign);
        const bloodGroup = selectedPatient?.blood_group ?? "";
        const billAmount = calculateBill(bloodGroup, unitsAssigned);
        navigate("/billing", {
          state: {
            patient: selectedPatient,
            request: {
              ...selectedPatient,
              units_assigned: unitsAssigned,
              stock_id: selectedStock.stock_id,
              bill_amount: billAmount
            }
          }
        });
      }
      alert("✅ Blood distributed successfully!");
    } catch {
      setInfoMessage("Failed to distribute blood (network or server error).");
    }
  }

  return (
    <div className="container mt-4">
      <h2>🩸 Blood Distribution</h2>
      {infoMessage && (<div className="alert alert-info" role="alert">{infoMessage}</div>)}
      <div className="mb-3">
        <select className="form-select" onChange={e => handlePatientSelect(e.target.value)} defaultValue="">
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.patient_id} value={p.patient_id}>{p.name} ({p.patient_id})</option>
          ))}
        </select>
      </div>
      {selectedPatient && (
        <div className="card p-3 mb-4">
          <h5>Patient / Request</h5>
          <p><strong>Request ID:</strong> {selectedPatient.request_id}</p>
          <p><strong>Patient:</strong> {selectedPatient.patient_name} ({selectedPatient.patient_id})</p>
          <p><strong>Blood Group:</strong> {selectedPatient.blood_group}</p>
          <p><strong>Units Required:</strong> {selectedPatient.units_requested}</p>
          <p><strong>Hospital:</strong> {selectedPatient.hospital_name} ({selectedPatient.hospital_id})</p>
        </div>
      )}
      {matchingStock.length > 0 && (
        <div className="card p-3 mb-3">
          <h5>Matching Stock</h5>
          <select className="form-select mb-2" onChange={e => handleStockSelect(e.target.value)} defaultValue="">
            <option value="">Select Stock</option>
            {matchingStock.map(s => (
              <option key={s.stock_id} value={s.stock_id}>
                {s.stock_id} — {s.blood_group} — {s.units_available} units — {s.hospital_id}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Units to assign"
            value={unitsToAssign}
            onChange={e => setUnitsToAssign(e.target.value)}
          />
          {selectedStock && selectedPatient && unitsToAssign &&
            <div className="mb-2">
              <b>Calculated Bill:</b> ₹ {calculateBill(selectedPatient.blood_group, unitsToAssign)}
            </div>
          }
          <button className="btn btn-danger" onClick={handleDistribute}>
            Distribute Blood
          </button>
        </div>
      )}
    </div>
  );
}
