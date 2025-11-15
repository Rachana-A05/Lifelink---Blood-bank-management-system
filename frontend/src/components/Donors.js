import { useEffect, useState } from "react";
import api from "../services/api";

// Change this to require min days between donations
const MIN_DONATE_DAYS = 56; // 56 days ~ 8 weeks (medical standard)

function daysBetween(date1, date2) {
  if (!date1 || !date2) return Infinity;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((d2 - d1) / msPerDay);
}

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState({
    donor_id: "",
    name: "",
    blood_group: "A+",
    gender: "M",
    contact: "",
    last_donation_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/donors");
        if (active) setDonors(res.data || []);
      } catch (e) {
        console.error("Error fetching donors:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    // Date check: last_donation_date must be at least MIN_DONATE_DAYS before today
    const today = new Date();
    const lastDate = form.last_donation_date;
    if (lastDate) {
      const diff = daysBetween(lastDate, today);
      if (diff < MIN_DONATE_DAYS) {
        setError(`⛔ Eligible only after ${MIN_DONATE_DAYS - diff} more day(s)!`);
        return;
      }
    }
    try {
      await api.post("/donors", form);
      setForm({ donor_id: "", name: "", blood_group: "A+", gender: "M", contact: "", last_donation_date: "" });
      const res = await api.get("/donors");
      setDonors(res.data || []);
    } catch (err) {
      alert("Error: " + (err?.response?.data?.error || err.message));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete donor ${id}?`)) return;
    try {
      await api.delete(`/donors/${id}`);
      setDonors(prev => prev.filter(d => d.donor_id !== id));
    } catch (e) {
      alert("Failed to delete donor.");
    }
  }

  return (
    <div>
      <h2>Donors</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <input className="input" placeholder="Donor ID (e.g. D011)" value={form.donor_id} onChange={e => setForm({ ...form, donor_id: e.target.value })} required />
            <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <select className="input" value={form.blood_group} onChange={e => setForm({ ...form, blood_group: e.target.value })}>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
            <select className="input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
              <option value="M">Male</option><option value="F">Female</option><option value="O">Others</option>
            </select>
          </div>
          <div className="form-row">
            <input className="input" placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            <label style={{ marginRight: 6 }}>Last Donation Date:</label>
            <input className="input" type="date" value={form.last_donation_date} onChange={e => setForm({ ...form, last_donation_date: e.target.value })} />
            <button className="btn" type="submit">Add Donor</button>
          </div>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
      </div>
      <div className="table-wrap">
        {loading ? <p>Loading donors...</p> :
          donors.length === 0 ? <p>No donors found.</p> :
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>BG</th><th>Gender</th><th>Contact</th><th>Last Donation</th><th></th></tr>
              </thead>
              <tbody>
                {donors.map(d => (
                  <tr key={d.donor_id}>
                    <td>{d.donor_id}</td>
                    <td>{d.name}</td>
                    <td>{d.blood_group}</td>
                    <td>{d.gender}</td>
                    <td>{d.contact}</td>
                    <td>{d.last_donation_date || "-"}</td>
                    <td><button className="btn secondary" onClick={() => handleDelete(d.donor_id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>}
      </div>
    </div>
  );
}
