import { useEffect, useState } from "react";
import api from "../services/api";

export default function LabTests() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    test_id: "",
    donation_id: "",
    result: "Pass",
    remarks: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLabTests();
  }, []);

  async function fetchLabTests() {
    setLoading(true);
    try {
      const res = await api.get("/labtests");
      setList(res.data || []);
    } catch (err) {
      console.error("Error loading lab tests:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addLabTest(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/labtests", form);
      await fetchLabTests();
      setForm({ test_id: "", donation_id: "", result: "Pass", remarks: "" });
      alert("Lab test added!");
    } catch (err) {
      console.error("Add lab test error:", err);
      alert("Failed to add lab test.");
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    if (!window.confirm("Delete lab test?")) return;
    try {
      await api.delete(`/labtests/${id}`);
      setList(prev => prev.filter(t => t.test_id !== id));
    } catch (err) {
      alert("Failed to delete lab test.");
    }
  }

  return (
    <div>
      <h2>Lab Tests</h2>
      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={addLabTest}>
          <div className="form-row">
            <input
              className="input"
              placeholder="Test ID"
              value={form.test_id}
              onChange={e => setForm({ ...form, test_id: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Donation ID"
              value={form.donation_id}
              onChange={e => setForm({ ...form, donation_id: e.target.value })}
              required
            />
            <select
              className="input"
              value={form.result}
              onChange={e => setForm({ ...form, result: e.target.value })}
              required
            >
              <option>Pass</option>
              <option>Fail</option>
            </select>
            <input
              className="input"
              placeholder="Remarks"
              value={form.remarks}
              onChange={e => setForm({ ...form, remarks: e.target.value })}
            />
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Lab Test"}
            </button>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        {loading ? <p>Loading…</p> : list.length === 0 ? <p>No lab tests found.</p> : (
          <table>
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Donation ID</th>
                <th>Result</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(t => (
                <tr key={t.test_id}>
                  <td>{t.test_id}</td>
                  <td>{t.donation_id}</td>
                  <td>{t.result}</td>
                  <td>{t.remarks}</td>
                  <td>
                    <button className="btn secondary" onClick={() => del(t.test_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
