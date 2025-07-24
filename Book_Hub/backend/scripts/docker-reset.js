const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function resetDockerPostgres() {
  console.log("🔄 Resetting Docker PostgreSQL")
  console.log("==============================\n")

  try {
    // Stop container
    console.log("🛑 Stopping PostgreSQL container...")
    try {
      await execAsync("docker stop postgres-bookhub")
      console.log("✅ Container stopped")
    } catch (error) {
      console.log("ℹ️  Container was not running")
    }

    // Remove container
    console.log("🗑️  Removing PostgreSQL container...")
    try {
      await execAsync("docker rm postgres-bookhub")
      console.log("✅ Container removed")
    } catch (error) {
      console.log("ℹ️  Container was already removed")
    }

    // Create new container with explicit settings
    console.log("🐘 Creating fresh PostgreSQL container...")
    const createCommand = `docker run --name postgres-bookhub \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_DB=postgres \
      -p 5432:5432 \
      -d postgres:13`

    await execAsync(createCommand.replace(/\s+/g, " "))
    console.log("✅ Fresh PostgreSQL container created!")

    // Wait for startup
    console.log("⏳ Waiting for PostgreSQL to start (15 seconds)...")
    await new Promise((resolve) => setTimeout(resolve, 15000))

    console.log("\n🎉 PostgreSQL reset complete!")
    console.log("\n📝 Make sure your .env file has:")
    console.log("   DB_USER=postgres")
    console.log("   DB_PASSWORD=postgres")
    console.log("   DB_HOST=localhost")
    console.log("   DB_NAME=postgres")
    console.log("   DB_PORT=5432")

    console.log("\n🧪 Now run: npm run test-db")
  } catch (error) {
    console.error("❌ Reset failed:", error.message)
    console.log("\n🔧 Manual steps:")
    console.log("   1. Open Docker Desktop")
    console.log("   2. Find 'postgres-bookhub' container")
    console.log("   3. Delete it")
    console.log("   4. Run: npm run docker-setup")
  }
}

resetDockerPostgres().catch(console.error)
