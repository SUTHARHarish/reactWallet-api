import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { initDB } from './config/db.js';
import rateLimiter from './config/upstash.js'; // optional, based on your logic
import rateLimitMiddleware from './middleware/rateLimit.js';
import transactionRoute from './routes/transactionRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

console.log("PORT: ", PORT);

// ✅ Add CORS FIRST before any routes or middleware
app.use(cors({
  origin: "http://localhost:8081", // frontend origin
  credentials: true,              // required if sending cookies/auth headers
}));

// ✅ Middlewares
app.use(rateLimitMiddleware);     // upstash/custom rate limiter
app.use(express.json());          // parses JSON body

// ✅ Logging middleware (optional, dev only)
app.use((req, res, next) => {
  console.log("📦 [Log] Method:", req.method, "→", req.url);
  next();
});

// ✅ Health check route
app.get("/health", (req, res) => {
  res.send("✔️ Server is working (GET /health)");
});

// ✅ Transactions API route
app.use("/api/transactions", transactionRoute); 
// ⚠️ note: use "/transactions" (plural) to match route logic better

// ✅ Init DB + Start Server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
