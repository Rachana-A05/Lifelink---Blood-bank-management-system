import { useEffect, useState } from "react";
import api from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    request_id: "",
    patient_id: "",
    hospital_id: "",
    blood_group: "",
    units_requested: 1,
    status: "Pending"
  });
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [rRes, pRes, hRes] = await Promise.all([
          api.get("/requests"),
          api.get("/patients"),
          api.get("/hospitals"),
        ]);
        setRequests(rRes.data || []);
        setPatients(pRes.data || []);
        setHospitals(hRes.data || []);
      } catch (e) {
        alert("Error fetching initial data");
      }
    })();
  }, []);

  useEffect(() => {
    if (!form.patient_id) {
      setPatientDetails(null);
      setForm(f => ({
        ...f,
        blood_group: "",
        hospital_id: "",
      }));
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/patients/${form.patient_id}`);
        const pat = res.data || {};
        setPatientDetails(pat);
        setForm(f => ({
          ...f,
          blood_group: pat.blood_group || "",
          hospital_id: pat.hospital_id || "",
        }));
      } catch {
        setPatientDetails(null);
        setForm(f => ({
          ...f,
          blood_group: "",
          hospital_id: "",
        }));
      }
    })();
  }, [form.patient_id]);

  function isFormValid() {
    return (
      form.request_id &&
      form.patient_id &&
      form.hospital_id &&
      form.blood_group &&
      form.units_requested
    );
  }

  async function createRequest(e) {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await api.post("/requests", form);
      setForm({
        request_id: "",
        patient_id: "",
        hospital_id: "",
        blood_group: "",
        units_requested: 1,
        status: "Pending"
      });
      setPatientDetails(null);
      fetchRequests();
      alert("Request created");
    } catch (e) {
      alert("Failed to create request");
    }
  }

  async function fetchRequests() {
    try {
      const res = await api.get("/requests");
      setRequests(res.data || []);
    } catch (e) {}
  }

  async function updateStatus(request_id, status) {
    try {
      await api.put(`/requests/${request_id}/status`, { status });
      fetchRequests();
    } catch (e) {
      alert("Failed to update status");
    }
  }

  function getHospitalName(id) {
    const hosp = hospitals.find(h => h.hospital_id === id);
    return hosp ? hosp.name : id || "-";
  }

  function statusStyle(status) {
    if (status === "Approved") return { color: "#3bb143", fontWeight: "bold"};
    if (status === "Rejected") return { color: "#d11a2a", fontWeight: "bold"};
    return { fontWeight: "bold"};
  }

  return (
    <div>
      <h2>Blood Requests</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <h4>Create Request</h4>
        <form onSubmit={createRequest}>
          <div className="form-row">
            <select
              className="input"
              value={form.patient_id}
              onChange={e => setForm({ ...form, patient_id: e.target.value })}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(p =>
                <option key={p.patient_id} value={p.patient_id}>
                  {p.name} ({p.patient_id})
                </option>
              )}
            </select>
            <select
              className="input"
              value={form.hospital_id}
              onChange={e => setForm({ ...form, hospital_id: e.target.value })}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h =>
                <option key={h.hospital_id} value={h.hospital_id}>{h.name}</option>
              )}
            </select>
            <input
              className="input"
              value={form.blood_group}
              readOnly
              required
              placeholder="Blood Group"
            />
            <input
              className="input"
              type="number"
              min="1"
              value={form.units_requested}
              onChange={e => setForm({ ...form, units_requested: Number(e.target.value) })}
              required
              placeholder="Units"
            />
          </div>
          <div className="form-row">
            <input className="input" placeholder="Request ID" value={form.request_id} onChange={e => setForm({ ...form, request_id: e.target.value })} />
            <button className="btn" type="submit">Create Request</button>
          </div>
        </form>
      </div>

      {patientDetails && (
        <div className="card" style={{ marginBottom: 12, background: "#f1f7fa" }}>
          <b>Patient Details:</b>
          <div>Name: {patientDetails.name}</div>
          <div>Blood Group: {patientDetails.blood_group}</div>
          <div>Contact: {patientDetails.contact}</div>
          <div>Hospital: {getHospitalName(patientDetails.hospital_id)}</div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Patient</th><th>Hospital</th><th>BG</th><th>Units</th><th>Status / Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="7">No requests found.</td></tr>
            ) : (
              requests.map((r, idx) => (
                <tr key={r.request_id || `req-${idx}`}>
                  <td>{r.request_id}</td>
                  <td>{r.patient_name}</td>
                  <td>{r.hospital_name}</td>
                  <td>{r.blood_group}</td>
                  <td>{r.units_requested}</td>
                  <td>
                    <span style={statusStyle(r.status)}>{r.status}</span>
                    <span style={{ marginLeft: 24 }}>
                      <button
                        type="button"
                        className="btn"
                        style={{ marginRight: 8, background: "#3bb143", color: "#fff"}}
                        onClick={() => updateStatus(r.request_id, "Approved")}
                      >Approve</button>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: "#d11a2a", color: "#fff"}}
                        onClick={() => updateStatus(r.request_id, "Rejected")}
                      >Reject</button>
                    </span>
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
