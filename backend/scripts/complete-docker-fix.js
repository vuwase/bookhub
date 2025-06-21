const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function completeDockerFix() {
  console.log("🔧 Complete Docker PostgreSQL Fix")
  console.log("=================================\n")

  // Step 1: Fix .env file
  console.log("📝 Step 1: Fixing .env file...")
  const envPath = path.join(__dirname, "..", ".env")

  const correctEnvContent = `# Vite environment variables must be prefixed with VITE_
VITE_API_URL=http://localhost:5000

# Docker PostgreSQL Configuration - CORRECTED
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_NAME=postgres
DB_PORT=5432

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Frontend URL (optional)
FRONTEND_URL=http://localhost:5173
`

  try {
    fs.writeFileSync(envPath, correctEnvContent)
    console.log("✅ .env file updated with correct settings")
  } catch (error) {
    console.log("❌ Could not update .env file:", error.message)
    console.log("📝 Please manually update your .env file with:")
    console.log("   DB_PASSWORD=postgres")
  }

  // Step 2: Reset Docker container
  console.log("\n🐳 Step 2: Resetting Docker container...")

  try {
    // Stop container
    try {
      await execAsync("docker stop postgres-bookhub")
      console.log("✅ Stopped existing container")
    } catch (e) {
      console.log("ℹ️  Container was not running")
    }

    // Remove container
    try {
      await execAsync("docker rm postgres-bookhub")
      console.log("✅ Removed existing container")
    } catch (e) {
      console.log("ℹ️  Container was already removed")
    }

    // Create new container with explicit environment variables
    console.log("🐘 Creating fresh PostgreSQL container...")
    const createCommand = `docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:13`

    const { stdout } = await execAsync(createCommand)
    console.log("✅ Fresh container created:", stdout.trim())

    // Wait for container to be ready
    console.log("⏳ Waiting for PostgreSQL to start (20 seconds)...")
    await new Promise((resolve) => setTimeout(resolve, 20000))

    // Verify container is running
    const { stdout: psOutput } = await execAsync(
      "docker ps --filter name=postgres-bookhub --format 'table {{.Names}}\\t{{.Status}}'",
    )
    console.log("📦 Container status:")
    console.log(psOutput)
  } catch (error) {
    console.error("❌ Docker setup failed:", error.message)
    return false
  }

  // Step 3: Test connection
  console.log("\n🧪 Step 3: Testing database connection...")

  // Clear require cache to reload .env
  delete require.cache[require.resolve("dotenv")]
  require("dotenv").config()

  const { Pool } = require("pg")

  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "postgres",
    port: 5432,
    ssl: false,
    connectionTimeoutMillis: 5000,
  })

  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW() as current_time, version() as pg_version")

    console.log("✅ Database connection successful!")
    console.log(`⏰ Current time: ${result.rows[0].current_time}`)
    console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version.split(",")[0]}`)

    client.release()
    await pool.end()

    console.log("\n🎉 Everything is working correctly!")
    console.log("\n📋 Next steps:")
    console.log("   1. Run: npm run create-tables")
    console.log("   2. Run: npm start")

    return true
  } catch (error) {
    console.error("❌ Connection test failed:", error.message)
    console.log("\n🔍 Debug info:")
    console.log("   DB_USER:", process.env.DB_USER)
    console.log("   DB_PASSWORD:", process.env.DB_PASSWORD ? "***" + process.env.DB_PASSWORD.slice(-2) : "NOT SET")
    console.log("   DB_HOST:", process.env.DB_HOST)
    console.log("   DB_NAME:", process.env.DB_NAME)
    console.log("   DB_PORT:", process.env.DB_PORT)

    await pool.end()
    return false
  }
}

completeDockerFix().catch(console.error)
