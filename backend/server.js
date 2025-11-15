// backend/server.js
import express from "express";
import cors from "cors";
import donorsRoutes from "./routes/donors.js";
import hospitalsRoutes from "./routes/hospitals.js";
import patientsRoutes from "./routes/patients.js";
import requestsRoutes from "./routes/requests.js";
import billingRoutes from "./routes/billing.js";
import stockRoutes from "./routes/stock.js";
import labTestsRoutes from "./routes/labtests.js";
import distributionRoutes from "./routes/distribution.js"; // ✅ change this line
import dashboardRoutes from "./routes/dashboard.js";
import logsRoutes from "./routes/logs.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use consistent ESM imports for all routes
app.use("/api/donors", donorsRoutes);
app.use("/api/hospitals", hospitalsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/labtests", labTestsRoutes);
app.use("/api/distribution", distributionRoutes); // ✅ updated
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", logsRoutes);

app.get("/", (req, res) =>
  res.send({ ok: true, message: "Blood Bank API Running ✅" })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
