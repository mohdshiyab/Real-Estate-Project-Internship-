// server.js — entry point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// Health check
app.get("/", (_req, res) => res.json({ ok: true, service: "Aurum Estates API" }));

// Routes
app.use("/api/properties", propertyRoutes);

// 404
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🏛  Aurum Estates API running on http://localhost:${PORT}`));
});
