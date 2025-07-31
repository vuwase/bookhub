const { exec } = require("child_process")
const util = require("util")
const execAsync = util.promisify(exec)

async function runCommand(command, description) {
  console.log(`\n🔍 ${description}`)
  console.log(`   Command: ${command}`)
  try {
    const { stdout, stderr } = await execAsync(command)
    if (stdout) {
      console.log("   ✅ Output:", stdout.trim())
    }
    if (stderr) {
      console.log("   ⚠️  Stderr:", stderr.trim())
    }
    return true
  } catch (error) {
    console.log("   ❌ Error:", error.message)
    return false
  }
}

async function troubleshootDocker() {
  console.log("🔧 Docker Troubleshooting")
  console.log("=========================")

  // Check Docker version
  await runCommand("docker --version", "Checking Docker installation")

  // Check Docker status
  await runCommand("docker info", "Checking Docker status")

  // List all containers
  await runCommand("docker ps -a", "Listing all containers")

  // Check PostgreSQL container specifically
  await runCommand("docker ps -a --filter name=postgres-bookhub", "Checking PostgreSQL container")

  // Check container logs if it exists
  try {
    await runCommand("docker logs postgres-bookhub", "Checking PostgreSQL logs")
  } catch (error) {
    console.log("   ℹ️  No PostgreSQL container found")
  }

  // Check port usage
  await runCommand("netstat -an | findstr :5432", "Checking if port 5432 is in use")

  console.log("\n💡 Common Solutions:")
  console.log("   1. Make sure Docker Desktop is running")
  console.log("   2. Restart Docker Desktop if needed")
  console.log("   3. If port 5432 is busy, stop other PostgreSQL services")
  console.log("   4. Try: docker stop postgres-bookhub && docker rm postgres-bookhub")
  console.log("   5. Then run: npm run docker-setup")
}

troubleshootDocker().catch(console.error)
