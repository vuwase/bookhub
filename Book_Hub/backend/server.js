const { Client } = require('pg');
const RETRY_INTERVAL = 5000;

async function connectWithRetry() {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");
    client.end();
  } catch (err) {
    console.error("❌ PostgreSQL not ready, retrying in 5s...");
    setTimeout(connectWithRetry, RETRY_INTERVAL);
  }
}

connectWithRetry();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();


// Database connection with better error handling
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "bookhub",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 5432,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection with detailed error handling
const testDatabaseConnection = async () => {
  try {
    console.log("🔍 Testing database connection...");
    console.log(`📊 Connecting to: ${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || "bookhub"}`);
    console.log(`👤 User: ${process.env.DB_USER || "postgres"}`);

    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as current_time");

    console.log("✅ Database connection successful!");
    console.log(`⏰ Current time: ${result.rows[0].current_time}`);

    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(`   Error Code: ${error.code}`);
    console.error(`   Error Message: ${error.message}`);

    if (error.code === "ECONNREFUSED") {
      console.error("   🔧 Solution: Make sure PostgreSQL is running on your system");
      console.error("   📝 Try: brew services start postgresql (Mac) or sudo service postgresql start (Linux)");
    } else if (error.code === "28P01") {
      console.error("   🔧 Solution: Check your database credentials in .env file");
    } else if (error.code === "3D000") {
      console.error("   🔧 Solution: Database doesn't exist. Create it first:");
      console.error("   📝 Run: CREATE DATABASE bookhub;");
    }

    return false;
  }
};

// Make database available to routes
app.locals.db = pool;

// Trust proxy for Codespaces/production environments
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  skip: (req) => process.env.NODE_ENV === "development",
});
app.use(limiter);

// CORS configuration for frontend connection
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (
      process.env.NODE_ENV === 'development' || 
      origin.includes('localhost') || 
      origin.includes(process.env.FRONTEND_URL)
    ) {
      return callback(null, true);
    }
    
    // Reject other origins in production
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to BookHub API",
    endpoints: {
      books: "/api/books",
      health: "/api/health",
      test: "/api/test",
      debug: "/api/debug/routes"
    }
  });
});

// Health Check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM books");
    res.json({ 
      status: "healthy", 
      booksCount: result.rows[0].count,
      timestamp: new Date() 
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API test successful" });
});

// Test Database Connection
app.get("/api/test/connection", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT current_database() as db, current_schema() as schema, COUNT(*) as book_count FROM books"
    );
    res.json({
      status: "success",
      database: rows[0].db,
      schema: rows[0].schema,
      bookCount: rows[0].book_count,
      frontendConnection: req.get("origin") || "Direct API call"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug Routes
app.get("/api/debug/routes", (req, res) => {
  const routes = [
    { method: "GET", path: "/api/books", description: "Get all books" },
    { method: "GET", path: "/api/books/:id", description: "Get single book" },
    { method: "POST", path: "/api/books", description: "Create new book" },
    { method: "PUT", path: "/api/books/:id", description: "Update book" },
    { method: "DELETE", path: "/api/books/:id", description: "Delete book" },
    { method: "GET", path: "/api/books/filter", description: "Filter books" }
  ];
  res.json(routes);
});

// BOOK CRUD ENDPOINTS

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books ORDER BY title");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book
app.get("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, genre, rating, pages, year, description, cover_image, isbn, publisher } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }
    
    const { rows } = await pool.query(
      `INSERT INTO books (
        title, author, genre, rating, pages, year, 
        description, cover_image, isbn, publisher
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [title, author, genre, rating, pages, year, description, cover_image, isbn, publisher]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
app.put("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, rating, pages, year, description, cover_image, isbn, publisher } = req.body;
    
    const existing = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    const { rows } = await pool.query(
      `UPDATE books SET
        title = $1, author = $2, genre = $3, rating = $4,
        pages = $5, year = $6, description = $7,
        cover_image = $8, isbn = $9, publisher = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *`,
      [title, author, genre, rating, pages, year, description, cover_image, isbn, publisher, id]
    );
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter books
app.get("/api/books/filter", async (req, res) => {
  try {
    const { genre, minRating, maxYear, search } = req.query;
    let query = "SELECT * FROM books WHERE 1=1";
    const params = [];
    let paramCount = 1;
    
    if (genre) {
      query += ` AND genre ILIKE $${paramCount++}`;
      params.push(`%${genre}%`);
    }
    
    if (minRating) {
      query += ` AND rating >= $${paramCount++}`;
      params.push(parseFloat(minRating));
    }
    
    if (maxYear) {
      query += ` AND year <= $${paramCount++}`;
      params.push(parseInt(maxYear));
    }
    
    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount++})`;
      params.push(`%${search}%`);
    }
    
    query += " ORDER BY title";
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  const dbConnected = await testDatabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    
    if (!dbConnected) {
      console.log("⚠️  Warning: Database connection failed");
    }
  });
};

startServer().catch(console.error);

module.exports = app;