import { useEffect, useState } from "react";
import api from "../services/api";

export default function Hospitals() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    hospital_id: "",
    name: "",
    address: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true; // ✅ Prevents updates after unmount

    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/hospitals");
        if (active) setList(res.data);
      } catch (e) {
        console.error("Error fetching hospitals:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    // ✅ Proper cleanup (no Promise return)
    return () => {
      active = false;
    };
  }, []);

  async function addHospital(e) {
    e.preventDefault();
    try {
      await api.post("/hospitals", form);
      setForm({ hospital_id: "", name: "", address: "", contact: "" });

      // Refresh list immediately after adding
      const res = await api.get("/hospitals");
      setList(res.data);
    } catch (e) {
      console.error("Error adding hospital:", e);
      alert("Error adding hospital. Check your inputs or database.");
    }
  }

  async function deleteHospital(id) {
    if (!window.confirm("Delete hospital?")) return;
    try {
      await api.delete(`/hospitals/${id}`);
      setList((prev) => prev.filter((h) => h.hospital_id !== id));
    } catch (e) {
      console.error("Error deleting hospital:", e);
      alert("Failed to delete hospital.");
    }
  }

  return (
    <div>
      <h2>Hospitals</h2>

      <div className="card" style={{ marginBottom: 12 }}>
        <form onSubmit={addHospital}>
          <div className="form-row">
            <input
              className="input"
              placeholder="Hospital ID"
              value={form.hospital_id}
              onChange={(e) =>
                setForm({ ...form, hospital_id: e.target.value })
              }
              required
            />
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
          </div>

          <div className="form-row">
            <input
              className="input"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={{ flex: 1 }}
            />
            <button className="btn" type="submit">
              Add Hospital
            </button>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        {loading ? (
          <p>Loading hospitals...</p>
        ) : list.length === 0 ? (
          <p>No hospitals available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((h) => (
                <tr key={h.hospital_id}>
                  <td>{h.hospital_id}</td>
                  <td>{h.name}</td>
                  <td>{h.address}</td>
                  <td>{h.contact}</td>
                  <td>
                    <button
                      className="btn secondary"
                      onClick={() => deleteHospital(h.hospital_id)}
                    >
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
