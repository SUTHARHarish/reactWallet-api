import express from "express";
import cors from "cors";

const app = express();

// ✅ CORS should come early
app.use(cors({
  origin: "http://localhost:8081",
  credentials: true,
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Routes
app.use("/api/transactions", transactionRoutes);
