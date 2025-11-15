// frontend/src/components/Navbar.js
import { Link, useLocation } from "react-router-dom";

export default function Navbar(){
  const loc = useLocation();
  return (
    <header className="navbar">
      {/* frontend/src/components/Dashboard.js */}
<div
  style={{
    color: "white",
    padding: "10px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    
  }}
>
  <h1
    style={{
      fontFamily: "'Poppins', sans-serif",
      fontWeight: "700",
      fontSize: "28px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
    }}
  >
    🩸<span style={{ color: "#fff" }}>LifeLink </span>
  </h1>
  <p
    style={{
      margin: 0,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "10px",
      letterSpacing: "0.5px",
    }}
  >
       - Connecting Donors, Hospitals and Hope
  </p>
</div>

      <nav className="nav-links">
        <Link to="/" className={loc.pathname === "/" ? "active" : ""}>Dashboard</Link>
        <Link to="/donors">Donors</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/requests">Requests</Link>
        <Link to="/stock">Stock</Link>
        <Link to="/distribution">Distribution</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/logs">System Logs</Link>
        <Link to="/hospitals">Hospitals</Link>
        

      </nav>
    </header>
  );
}
