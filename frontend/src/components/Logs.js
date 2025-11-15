import { useEffect, useState } from "react";
import api from "../services/api";

export default function SystemLogs() {
  const [data, setData] = useState({ billing: [], stock: [], donation: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [billing, stock, donation] = await Promise.all([
          api.get("/billing_logs"),
          api.get("/stock_alerts"),
          api.get("/donation_logs"),
        ]);
        setData({
          billing: billing.data || [],
          stock: stock.data || [],
          donation: donation.data || [],
        });
        setLoading(false);
      } catch (err) {
        console.warn("⚠️ Logs not ready yet. Retrying in 2s...");
        setTimeout(loadData, 2000); // Try again after 2 seconds
      }
    };
    loadData();
  }, []);

  if (loading) return <p>Loading system logs...</p>;

  return (
    <div>
      <h2>🩸 System Logs</h2>

      <h3>Billing Logs</h3>
      <ul>
        {data.billing.map((b, i) => (
          <li key={i}>{b.bill_id} - {b.action} - {b.logged_at}</li>
        ))}
      </ul>

      <h3>Donation Logs</h3>
      <ul>
        {data.donation.map((d, i) => (
          <li key={i}>{d.donation_id} - {d.action} - {d.logged_at}</li>
        ))}
      </ul>

      <h3>Stock Alerts</h3>
      <ul>
        {data.stock.map((s, i) => (
          <li key={i}>{s.blood_group} - {s.message}</li>
        ))}
      </ul>
    </div>
  );
}
