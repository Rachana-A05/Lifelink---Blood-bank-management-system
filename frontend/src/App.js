// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Donors from "./components/Donors";
import Patients from "./components/Patients";
import Requests from "./components/Requests";
import Billing from "./components/Billing";
import Stock from "./components/Stock";
import Hospitals from "./components/Hospitals";
import StockDistribution from "./components/StockDistribution";
import Logs from "./components/Logs";
import LabTests from "./components/LabTests";
import Landing from './components/Landing';
// ... other imports

// ... routes for patients, stock, billing, etc.



export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/distribution" element={<StockDistribution />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/labtests" element={<LabTests />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </Router>
  );
}
