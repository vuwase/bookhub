const { Pool } = require("pg")
require("dotenv").config()

async function testDatabaseConnection() {
  console.log("🔍 Testing database connection...")
  console.log(`📊 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)
  console.log(`📊 Database: ${process.env.DB_NAME}`)
  console.log(`📊 User: ${process.env.DB_USER}`)
  console.log(`📊 Password: ${process.env.DB_PASSWORD ? "***" + process.env.DB_PASSWORD.slice(-2) : "NOT SET"}\n`)

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false,
  })

  try {
    const client = await pool.connect()
    console.log("✅ Database connection successful!")

    // Test basic query
    const result = await client.query("SELECT NOW() as current_time")
    console.log(`⏰ Current time: ${result.rows[0].current_time}`)

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    console.log(`📋 Found ${tablesResult.rows.length} tables:`)
    if (tablesResult.rows.length === 0) {
      console.log("   No tables found. Run 'npm run setup-tables' to create them.")
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`)
      })
    }

    client.release()
    await pool.end()
    console.log("\n🎉 Database test completed successfully!")
  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error(`   Error Code: ${error.code}`)
    console.error(`   Error Message: ${error.message}`)

    if (error.code === "ECONNREFUSED") {
      console.error("\n🔧 Solutions:")
      console.error("   1. Make sure PostgreSQL is installed and running")
      console.error("   2. Check if PostgreSQL service is started")
      console.error("   3. Verify the host and port in your .env file")
    } else if (error.code === "28P01") {
      console.error("\n🔧 Solutions:")
      console.error("   1. Check username and password in .env file")
      console.error("   2. Make sure the user exists in PostgreSQL")
      console.error("   3. Try using 'postgres' as the username")
    } else if (error.code === "3D000") {
      console.error("\n🔧 Solutions:")
      console.error("   1. Create the database: CREATE DATABASE bookhub;")
      console.error("   2. Make sure the database name is correct in .env")
    }

    await pool.end()
    process.exit(1)
  }
}

testDatabaseConnection()
