const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const { Pool } = require("pg")
require("dotenv").config()

const bookRoutes = require("./routes/books")
const authRoutes = require("./routes/auth")
const errorHandler = require("./middleware/errorHandler")

const app = express()

// Database connection with better error handling
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false, // Disable SSL for local development
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Test database connection with detailed error handling
const testDatabaseConnection = async () => {
  try {
    console.log("🔍 Testing database connection...")
    console.log(`📊 Connecting to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
    console.log(`👤 User: ${process.env.DB_USER}`)

    const client = await pool.connect()
    const result = await client.query("SELECT NOW() as current_time")

    console.log("✅ Database connection successful!")
    console.log(`⏰ Current time: ${result.rows[0].current_time}`)

    client.release()
    return true
  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error(`   Error Code: ${error.code}`)
    console.error(`   Error Message: ${error.message}`)

    if (error.code === "ECONNREFUSED") {
      console.error("   🔧 Solution: Make sure PostgreSQL is running on your system")
      console.error("   📝 Try: brew services start postgresql (Mac) or sudo service postgresql start (Linux)")
    } else if (error.code === "28P01") {
      console.error("   🔧 Solution: Check your database credentials in .env file")
    } else if (error.code === "3D000") {
      console.error("   🔧 Solution: Database doesn't exist. Create it first:")
      console.error("   📝 Run: CREATE DATABASE bookhub;")
    }

    return false
  }
}

// Make database available to routes
app.locals.db = pool

// Trust proxy for Codespaces/production environments
app.set("trust proxy", 1)

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  skip: (req) => process.env.NODE_ENV === "development",
})
app.use(limiter)

// CORS configuration for Codespaces
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173", process.env.FRONTEND_URL || "http://localhost:5173"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}
app.use(cors(corsOptions))

// Body parser middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes - Fix the auth routes mounting
app.use("/api/auth", authRoutes) // This should work now
app.use("/api/books", bookRoutes)

// Comprehensive API test endpoint
app.get("/api/test/connection", async (req, res) => {
  try {
    // Test database connection
    let dbStatus = "Connected"
    let bookCount = 0

    try {
      const result = await pool.query("SELECT COUNT(*) as count FROM books")
      bookCount = Number.parseInt(result.rows[0].count)
    } catch (dbError) {
      dbStatus = "Disconnected"
      console.error("Database test failed:", dbError.message)
    }

    res.json({
      success: true,
      message: "🎉 Full API connection test successful!",
      timestamp: new Date().toISOString(),
      server_info: {
        environment: process.env.NODE_ENV || "development",
        port: process.env.PORT || 5000,
        node_version: process.version,
      },
      database: {
        status: dbStatus,
        total_books: bookCount,
        connection_time: new Date().toISOString(),
      },
      frontend_connection: {
        note: "If you can see this response, your frontend is successfully connected to the backend!",
        cors_status: "Enabled",
        request_origin: req.get("origin") || "Direct API call",
      },
    })
  } catch (error) {
    console.error("Connection test error:", error)
    res.status(500).json({
      success: false,
      message: "Connection test failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Enhanced health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    let dbInfo = { status: "No database configured" }

    try {
      const result = await pool.query("SELECT NOW() as server_time, COUNT(*) as book_count FROM books")
      dbInfo = {
        status: "Connected",
        server_time: result.rows[0].server_time,
        total_books: Number.parseInt(result.rows[0].book_count),
      }
    } catch (dbError) {
      dbInfo = {
        status: "Disconnected",
        error: dbError.message,
      }
    }

    res.json({
      success: true,
      message: "Book Library API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: dbInfo,
      version: "1.0.0",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Root endpoint with better info
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "📚 Welcome to Book Library API",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    endpoints: {
      health: "GET /api/health - Check API status",
      test: "GET /api/test - Simple test",
      connection: "GET /api/test/connection - Full connection test",
      books: "GET /api/books - Get all books",
    },
  })
})

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "🎉 Test endpoint working!",
    timestamp: new Date().toISOString(),
  })
})

// Debug endpoint to show all available routes
app.get("/api/debug/routes", (req, res) => {
  res.json({
    success: true,
    message: "Available API routes",
    routes: {
      public_routes: [
        "GET /api/health - Health check",
        "GET /api/test - Test endpoint",
        "GET /api/books - Get all books",
        "GET /api/books/:id - Get single book",
        "GET /api/books/stats/summary - Get book statistics",
        "POST /api/auth/register - Register new user",
        "POST /api/auth/login - Login user",
      ],
      protected_routes: [
        "POST /api/books - Create book (requires auth)",
        "PUT /api/books/:id - Update book (requires auth)",
        "DELETE /api/books/:id - Delete book (requires auth)",
      ],
    },
    authentication_note: "To access protected routes, first register/login to get a JWT token",
  })
})

// Enhanced 404 handler
app.use("*", (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`)

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    suggestion: "Visit /api/test/connection to test your API connection",
    available_routes: [
      "GET / - API info",
      "GET /api/health - Health check",
      "GET /api/test - Simple test",
      "GET /api/test/connection - Full connection test",
      "GET /api/books - Get all books",
    ],
  })
})

// Error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Start server with database connection test
const startServer = async () => {
  console.log("🚀 Starting Book Library API...")
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 Port: ${PORT}`)

  // Test database connection first
  const dbConnected = await testDatabaseConnection()

  app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}`)
    console.log(`🔗 Local URL: http://localhost:${PORT}`)
    console.log(`🔗 Codespaces URL: Check PORTS tab for forwarded URL`)
    console.log(`🏥 Health Check: /api/health`)
    console.log(`🧪 Test API: /api/test`)
    console.log(`🔍 Debug Routes: /api/debug/routes`)

    if (!dbConnected) {
      console.log("\n⚠️  WARNING: Database connection failed!")
    }

    console.log("\n📖 Available endpoints:")
    console.log("   🟢 GET    / - API information")
    console.log("   🟢 GET    /api/health - Health check")
    console.log("   🟢 GET    /api/test - Simple test")
    console.log("   🟢 GET    /api/test/connection - Full connection test")
    console.log("   🟢 GET    /api/books - Get all books")
  })
}

startServer().catch(console.error)

module.exports = app
