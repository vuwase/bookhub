console.log("📋 Manual Docker Setup Steps")
console.log("============================\n")

console.log("🔧 Step 1: Fix .env file")
console.log("   Open your .env file and make sure it has:")
console.log("   DB_USER=postgres")
console.log("   DB_PASSWORD=postgres")
console.log("   DB_HOST=localhost")
console.log("   DB_NAME=postgres")
console.log("   DB_PORT=5432\n")

console.log("🐳 Step 2: Reset Docker container")
console.log("   Run these commands one by one:")
console.log("   1. docker stop postgres-bookhub")
console.log("   2. docker rm postgres-bookhub")
console.log("   3. docker run --name postgres-bookhub -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres\n")

console.log("⏳ Step 3: Wait")
console.log("   Wait 10-15 seconds for PostgreSQL to start\n")

console.log("🧪 Step 4: Test")
console.log("   npm run test-db\n")

console.log("📋 Step 5: Create tables")
console.log("   npm run create-tables\n")

console.log("🚀 Step 6: Start server")
console.log("   npm start\n")

console.log("🔍 Troubleshooting:")
console.log("   - Check if Docker Desktop is running")
console.log("   - Run 'docker ps' to see running containers")
console.log("   - If port 5432 is busy, restart your computer")
