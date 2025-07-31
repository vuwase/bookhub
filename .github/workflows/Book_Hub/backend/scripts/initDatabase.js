const pool = require("../config/database")
const fs = require("fs")
const path = require("path")

async function initDatabase() {
  try {
    console.log("Initializing database...")

    // Read and execute schema
    const schemaPath = path.join(__dirname, "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Split schema by statements and execute each
    const statements = schema.split(";").filter((stmt) => stmt.trim())

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement)
      }
    }

    console.log("✅ Database schema created successfully!")
    console.log("Now run: node scripts/seedData.js")
  } catch (error) {
    console.error("❌ Error initializing database:", error)
  } finally {
    await pool.end()
  }
}

// Run the initialization
initDatabase()
