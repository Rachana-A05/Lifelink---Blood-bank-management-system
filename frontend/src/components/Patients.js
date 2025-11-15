import { useEffect, useState } from "react";
import api from "../services/api";

export default function Patients() {
  const [list, setList] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    name: "",
    gender: "M",
    blood_group: "A+",
    contact: "",
    hospital_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [pRes, hRes] = await Promise.all([api.get("/patients"), api.get("/hospitals")]);
        if (!active) return;
        setList(Array.isArray(pRes.data) ? pRes.data : []);
        setHospitals(Array.isArray(hRes.data) ? hRes.data : []);
      } catch (err) {
        console.error("Error fetching patients/hospitals:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function addPatient(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/patients", form);
      const res = await api.get("/patients");
      setList(Array.isArray(res.data) ? res.data : []);
      setForm({
        patient_id: "",
        name: "",
        gender: "M",
        blood_group: "A+",
        contact: "",
        hospital_id: ""
      });
      alert("Patient added successfully!");
    } catch (err) {
      console.error("Add patient error:", err);
      alert("Failed to add patient. Check for duplication");
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      setList(prev => prev.filter(p => p.patient_id !== id));
    } catch (err) {
      console.error("Delete patient error:", err);
      alert("Failed to delete patient.");
    }
  }

  function getHospitalName(hospital_id) {
    const hosp = hospitals.find(h => h.hospital_id === hospital_id);
    return hosp ? hosp.name : hospital_id;
  }

  if (loading) return <p>Loading patients...</p>;

  return (
    <div>
      <h2>Patients</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={addPatient}>
          <div className="form-row">
            <input
              className="input"
              placeholder="Patient ID"
              value={form.patient_id}
              onChange={e => setForm({ ...form, patient_id: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              className="input"
              value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value })}
              required
            >
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="O">O</option>
            </select>
            <select
              className="input"
              value={form.blood_group}
              onChange={e => setForm({ ...form, blood_group: e.target.value })}
            >
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </div>
          <div className="form-row">
            <input
              className="input"
              placeholder="Contact"
              value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })}
            />
            <select
              className="input"
              value={form.hospital_id}
              onChange={e => setForm({ ...form, hospital_id: e.target.value })}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.hospital_id} value={h.hospital_id}>{h.name}</option>
              ))}
            </select>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
      <div className="table-wrap">
        {list.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Gender</th>
      <th>Blood Group</th>
      <th>Contact</th>
      <th>Hospital</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {list.length === 0 ? (
      <tr><td colSpan="7">No patients found.</td></tr>
    ) : (
      list.map(p => (
        <tr key={p.patient_id}>
          <td>{p.patient_id}</td>
          <td>{p.name}</td>
          <td>{p.gender || "-"}</td>
          <td>{p.blood_group}</td>
          <td>{p.contact}</td>
          <td>{getHospitalName(p.hospital_id)}</td>
          <td>
            <button className="btn secondary" onClick={() => del(p.patient_id)}>
              Delete
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

        )}
      </div>
    </div>
  );
}
