import { sql } from "../config/db.js";

// ✅ Get All Transactions by User ID
export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const transaction = await sql`
      SELECT * FROM transaction 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    res.status(200).json(transaction);
  } catch (error) {
    console.error("❌ Error getting the transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Create New Transaction
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof amount !== "number" || isNaN(amount)) {
      return res.status(400).json({ message: "Amount must be a valid number" });
    }

    const transaction = await sql`
      INSERT INTO transaction(user_id, title, category, amount)
      VALUES (${user_id}, ${title}, ${category}, ${amount})
      RETURNING *
    `;

    res.status(201).json({ message: "Transaction created", transaction: transaction[0] });
  } catch (error) {
    console.error("❌ Error creating the transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Delete Transaction by ID
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    const result = await sql`
      DELETE FROM transaction 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully", deleted: result[0] });
  } catch (error) {
    console.error("❌ Error deleting the transaction:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ Get Summary (Balance, Income, Expenses) by User ID
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance 
      FROM transaction 
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income 
      FROM transaction 
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses 
      FROM transaction 
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("❌ Error fetching summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
