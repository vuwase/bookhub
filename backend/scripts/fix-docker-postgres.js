const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function fixDockerPostgres() {
  console.log("🔧 Fixing Docker PostgreSQL Password Issue")
  console.log("==========================================\n")

  try {
    // First, let's check what's in the container
    console.log("🔍 Checking PostgreSQL container status...")
    const { stdout: psOutput } = await execAsync("docker ps --filter name=postgres-bookhub")
    console.log("Container status:", psOutput)

    // Try to connect to the container and reset the password
    console.log("\n🔐 Attempting to reset PostgreSQL password...")

    try {
      // Method 1: Try to connect and change password
      const resetCommand = `docker exec postgres-bookhub psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"`
      await execAsync(resetCommand)
      console.log("✅ Password reset successful!")
    } catch (error) {
      console.log("❌ Direct password reset failed, trying alternative method...")

      // Method 2: Recreate the container with correct settings
      console.log("🔄 Recreating PostgreSQL container with correct settings...")

      // Stop and remove existing container
      try {
        await execAsync("docker stop postgres-bookhub")
        console.log("✅ Stopped existing container")
      } catch (e) {
        console.log("ℹ️  Container was not running")
      }

      try {
        await execAsync("docker rm postgres-bookhub")
        console.log("✅ Removed existing container")
      } catch (e) {
        console.log("ℹ️  Container was already removed")
      }

      // Create new container with correct password
      console.log("🐘 Creating new PostgreSQL container...")
      const createCommand =
        "docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:13"
      await execAsync(createCommand)
      console.log("✅ New PostgreSQL container created!")

      // Wait for container to start
      console.log("⏳ Waiting for PostgreSQL to start...")
      await new Promise((resolve) => setTimeout(resolve, 10000))
    }

    // Test the connection
    console.log("\n🧪 Testing connection...")
    const { Pool } = require("pg")

    const pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "postgres",
      password: "postgres",
      port: 5432,
      ssl: false,
    })

    try {
      const client = await pool.connect()
      const result = await client.query("SELECT NOW() as current_time")
      console.log("✅ Connection successful!")
      console.log(`⏰ Current time: ${result.rows[0].current_time}`)
      client.release()
      await pool.end()

      console.log("\n🎉 PostgreSQL is now working correctly!")
      console.log("\n📝 Your .env file should have:")
      console.log("   DB_USER=postgres")
      console.log("   DB_PASSWORD=postgres")
      console.log("   DB_HOST=localhost")
      console.log("   DB_NAME=postgres")
      console.log("   DB_PORT=5432")
    } catch (connError) {
      console.error("❌ Connection still failing:", connError.message)
      console.log("\n🔧 Manual fix needed:")
      console.log("   1. Run: docker stop postgres-bookhub")
      console.log("   2. Run: docker rm postgres-bookhub")
      console.log("   3. Run: npm run docker-setup")
    }
  } catch (error) {
    console.error("❌ Error fixing PostgreSQL:", error.message)

    console.log("\n🔄 Let's try a complete reset:")
    console.log("   1. Run: docker stop postgres-bookhub")
    console.log("   2. Run: docker rm postgres-bookhub")
    console.log("   3. Run: npm run docker-setup")
  }
}

fixDockerPostgres().catch(console.error)
