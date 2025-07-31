const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "database",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "bookhub",  // Changed from "postgres" to "bookhub"
  user: process.env.DB_USER || "postgres",    // Added fallback for user
  password: process.env.DB_PASSWORD || "",    // Added fallback for password
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Enhanced connection testing
async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT current_database() as db, current_schema() as schema');
    console.log(`✅ Connected to database: ${res.rows[0].db}, schema: ${res.rows[0].schema}`);
    await client.query('SELECT 1 FROM books LIMIT 1'); // Test books table exists
    console.log('✓ Books table exists');
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

// Test connection on startup
testConnection();

module.exports = pool;