// frontend/src/components/Dashboard.js
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    donors: 0,
    patients: 0,
    requests: 0,
    stockUnits: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      try {
        const [donors, patients, requests, stocks] = await Promise.all([
          api.get("/donors"),
          api.get("/patients"),
          api.get("/requests"),
          api.get("/stock"),
        ]);

        if (!active) return;

        const totalUnits = Array.isArray(stocks.data)
          ? stocks.data.reduce((sum, x) => sum + Number(x.units || x.units_available || 0), 0)
          : 0;

        setCounts({
          donors: donors.data?.length || 0,
          patients: patients.data?.length || 0,
          requests: requests.data?.length || 0,
          stockUnits: totalUnits,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      {/* 🩸 Blood Bank Banner Image */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img
          src="/images/bloodbank.jpg" // ✅ Correct image path
          alt="Blood Bank Banner"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        />
        <h3 style={{ marginTop: 10, color: "#b91c1c" }}>
          💉 Donate Blood, Save Lives ❤️
        </h3>
      </div>

      <div className="row" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="title">Total Donors</div>
          <div className="big">{counts.donors}</div>
        </div>
        <div className="card">
          <div className="title">Total Patients</div>
          <div className="big">{counts.patients}</div>
        </div>
        <div className="card">
          <div className="title">Active Requests</div>
          <div className="big">{counts.requests}</div>
        </div>
        <div className="card">
          <div className="title">Units in Stock</div>
          <div className="big">{counts.stockUnits}</div>
        </div>
      </div>

      <div className="table-wrap">
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <p>
          Use the side links to manage donors, patients, requests, and billing.
          Create a request when a patient needs blood. Mark billing paid when payment is received.
        </p>
      </div>
    </div>
  );
}
