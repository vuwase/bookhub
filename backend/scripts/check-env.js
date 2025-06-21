require("dotenv").config()

console.log("🔍 Environment Variables Check")
console.log("==============================\n")

console.log("📝 Current .env settings:")
console.log(`   DB_USER: ${process.env.DB_USER || "NOT SET"}`)
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD || "NOT SET"}`)
console.log(`   DB_HOST: ${process.env.DB_HOST || "NOT SET"}`)
console.log(`   DB_NAME: ${process.env.DB_NAME || "NOT SET"}`)
console.log(`   DB_PORT: ${process.env.DB_PORT || "NOT SET"}`)

console.log("\n✅ Expected settings:")
console.log("   DB_USER: postgres")
console.log("   DB_PASSWORD: postgres")
console.log("   DB_HOST: localhost")
console.log("   DB_NAME: postgres")
console.log("   DB_PORT: 5432")

if (process.env.DB_PASSWORD !== "postgres") {
  console.log("\n❌ ISSUE FOUND: DB_PASSWORD is not 'postgres'")
  console.log("🔧 Fix: Update your .env file to have: DB_PASSWORD=postgres")
} else {
  console.log("\n✅ Environment variables look correct!")
}
