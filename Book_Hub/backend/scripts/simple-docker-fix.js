const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function simpleDockerFix() {
  console.log("🔧 Simple Docker PostgreSQL Fix")
  console.log("===============================\n")

  // Step 1: Fix .env file
  console.log("📝 Step 1: Fixing .env file...")
  const envPath = path.join(__dirname, "..", ".env")

  const correctEnvContent = `# Docker PostgreSQL Configuration
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

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Vite environment variables
VITE_API_URL=http://localhost:5000
`

  try {
    fs.writeFileSync(envPath, correctEnvContent)
    console.log("✅ .env file updated with correct password")
  } catch (error) {
    console.log("❌ Could not update .env file automatically")
    console.log("📝 Please manually set in your .env file:")
    console.log("   DB_PASSWORD=postgres")
  }

  // Step 2: Reset Docker container with simpler commands
  console.log("\n🐳 Step 2: Resetting Docker container...")

  try {
    // Stop container (ignore errors)
    console.log("🛑 Stopping existing container...")
    try {
      await execAsync("docker stop postgres-bookhub")
      console.log("✅ Container stopped")
    } catch (e) {
      console.log("ℹ️  Container was not running")
    }

    // Remove container (ignore errors)
    console.log("🗑️  Removing existing container...")
    try {
      await execAsync("docker rm postgres-bookhub")
      console.log("✅ Container removed")
    } catch (e) {
      console.log("ℹ️  Container was already removed")
    }

    // Create new container
    console.log("🐘 Creating fresh PostgreSQL container...")
    const createCommand = "docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres"

    const { stdout } = await execAsync(createCommand)
    console.log("✅ Fresh container created!")
    console.log("   Container ID:", stdout.trim())

    // Wait for container to start
    console.log("⏳ Waiting for PostgreSQL to start (15 seconds)...")
    await new Promise((resolve) => setTimeout(resolve, 15000))

    // Check if container is running with simpler command
    console.log("📦 Checking container status...")
    try {
      const { stdout: psOutput } = await execAsync("docker ps")
      if (psOutput.includes("postgres-bookhub")) {
        console.log("✅ Container is running!")
      } else {
        console.log("❌ Container might not be running")
        console.log("Full docker ps output:")
        console.log(psOutput)
      }
    } catch (e) {
      console.log("ℹ️  Could not check container status, but it should be running")
    }
  } catch (error) {
    console.error("❌ Docker setup failed:", error.message)
    console.log("\n🔧 Manual steps:")
    console.log("   1. docker stop postgres-bookhub")
    console.log("   2. docker rm postgres-bookhub")
    console.log("   3. docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres")
    return false
  }

  // Step 3: Test connection
  console.log("\n🧪 Step 3: Testing database connection...")

  // Reload environment variables
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
    const result = await client.query("SELECT NOW() as current_time")

    console.log("✅ Database connection successful!")
    console.log(`⏰ Current time: ${result.rows[0].current_time}`)

    client.release()
    await pool.end()

    console.log("\n🎉 Everything is working!")
    console.log("\n📋 Next steps:")
    console.log("   npm run create-tables")
    console.log("   npm start")

    return true
  } catch (error) {
    console.error("❌ Connection test failed:", error.message)
    console.log("\n🔍 Current settings:")
    console.log("   User:", process.env.DB_USER)
    console.log("   Password:", process.env.DB_PASSWORD)
    console.log("   Host:", process.env.DB_HOST)
    console.log("   Database:", process.env.DB_NAME)
    console.log("   Port:", process.env.DB_PORT)

    await pool.end()
    return false
  }
}

simpleDockerFix().catch(console.error)
