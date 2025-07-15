import {neon} from "@neondatabase/serverless"

import"dotenv/config"

// Create a sql connenet to data base url 
export const sql = neon(process.env.DATABASE_URL)


// ✅ Initialize the Database Table
export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transaction (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Transaction table created successfully.");
  } catch (error) {
    console.error("❌ Error creating transaction table:", error);
    process.exit(1);
  }
}