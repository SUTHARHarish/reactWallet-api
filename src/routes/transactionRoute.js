import express from 'express';
import {
  createTransaction,
  deleteTransaction,
  getTransactionByUserId,
  getSummaryByUserId
} from '../controllers/transactionCntroll.js';

const router = express.Router();

// ✅ More specific first
router.get("/summary/:userId", getSummaryByUserId);

// ✅ General one next
router.get("/:userId", getTransactionByUserId);

// ✅ Create
router.post("/", createTransaction);

// ✅ Delete
router.delete("/:id", deleteTransaction);

export default router;
