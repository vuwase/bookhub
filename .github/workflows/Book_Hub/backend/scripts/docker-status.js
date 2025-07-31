const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function checkDockerStatus() {
  console.log("🔍 Docker Status Check")
  console.log("=====================\n")

  try {
    // Check Docker version
    const { stdout: version } = await execAsync("docker --version")
    console.log("✅ Docker version:", version.trim())
  } catch (error) {
    console.log("❌ Docker not installed or not running")
    return
  }

  try {
    // List all containers
    console.log("\n📦 All containers:")
    const { stdout: allContainers } = await execAsync("docker ps -a")
    console.log(allContainers)
  } catch (error) {
    console.log("❌ Could not list containers:", error.message)
  }

  try {
    // Check specifically for postgres container
    console.log("\n🐘 PostgreSQL container:")
    const { stdout: pgContainer } = await execAsync("docker ps -a | findstr postgres-bookhub")
    if (pgContainer.trim()) {
      console.log(pgContainer)
    } else {
      console.log("❌ No postgres-bookhub container found")
    }
  } catch (error) {
    console.log("❌ No postgres-bookhub container found")
  }

  try {
    // Check running containers
    console.log("\n🏃 Running containers:")
    const { stdout: running } = await execAsync("docker ps")
    console.log(running)
  } catch (error) {
    console.log("❌ Could not check running containers:", error.message)
  }
}

checkDockerStatus().catch(console.error)
