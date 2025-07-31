const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function checkDocker() {
  try {
    const { stdout } = await execAsync("docker --version")
    console.log("✅ Docker is installed:", stdout.trim())
    return true
  } catch (error) {
    console.log("❌ Docker is not installed or not running")
    return false
  }
}

async function checkPostgresContainer() {
  try {
    const { stdout } = await execAsync('docker ps -a --filter name=postgres-bookhub --format "{{.Status}}"')
    if (stdout.trim()) {
      console.log("📦 PostgreSQL container exists:", stdout.trim())
      return stdout.trim().startsWith("Up")
    }
    return false
  } catch (error) {
    return false
  }
}

async function createPostgresContainer() {
  try {
    console.log("🐘 Creating PostgreSQL container...")
    const { stdout } = await execAsync(
      "docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres",
    )
    console.log("✅ PostgreSQL container created:", stdout.trim())

    // Wait a moment for container to start
    console.log("⏳ Waiting for PostgreSQL to start...")
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return true
  } catch (error) {
    console.error("❌ Failed to create container:", error.message)
    return false
  }
}

async function startPostgresContainer() {
  try {
    console.log("🚀 Starting PostgreSQL container...")
    await execAsync("docker start postgres-bookhub")
    console.log("✅ PostgreSQL container started")

    // Wait a moment for container to start
    await new Promise((resolve) => setTimeout(resolve, 3000))

    return true
  } catch (error) {
    console.error("❌ Failed to start container:", error.message)
    return false
  }
}

async function setupDockerPostgres() {
  console.log("🐳 Docker PostgreSQL Setup")
  console.log("===========================\n")

  // Check if Docker is installed
  const dockerInstalled = await checkDocker()
  if (!dockerInstalled) {
    console.log("\n📥 Please install Docker Desktop first:")
    console.log("   1. Go to: https://www.docker.com/products/docker-desktop/")
    console.log("   2. Download and install Docker Desktop")
    console.log("   3. Restart your computer")
    console.log("   4. Run this script again\n")
    return
  }

  // Check if PostgreSQL container exists
  const containerExists = await checkPostgresContainer()

  if (!containerExists) {
    // Create new container
    const created = await createPostgresContainer()
    if (!created) {
      console.log("\n❌ Failed to create PostgreSQL container")
      console.log("💡 Try running Docker Desktop first, then run this script again")
      return
    }
  } else {
    // Start existing container
    const started = await startPostgresContainer()
    if (!started) {
      console.log("\n❌ Failed to start PostgreSQL container")
      return
    }
  }

  console.log("\n🎉 PostgreSQL is running in Docker!")
  console.log("\n📝 Your .env file should have:")
  console.log("   DB_USER=postgres")
  console.log("   DB_PASSWORD=postgres")
  console.log("   DB_HOST=localhost")
  console.log("   DB_NAME=postgres")
  console.log("   DB_PORT=5432")

  console.log("\n🧪 Next steps:")
  console.log("   1. Update your .env file with the above settings")
  console.log("   2. Run: npm run test-db")
  console.log("   3. Run: npm run create-tables")

  console.log("\n🎮 Useful commands:")
  console.log("   docker ps                     # See running containers")
  console.log("   docker stop postgres-bookhub # Stop database")
  console.log("   docker start postgres-bookhub # Start database")
}

setupDockerPostgres().catch(console.error)
