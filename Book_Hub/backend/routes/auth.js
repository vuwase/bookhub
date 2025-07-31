const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")

const router = express.Router()

// Register endpoint
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { email, password, name } = req.body
      const db = req.app.locals.db

      // Check if user already exists
      const existingUser = await db.query("SELECT id FROM users WHERE email = $1", [email])
      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: "User already exists",
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const insertQuery = `
        INSERT INTO users (email, password, name) 
        VALUES ($1, $2, $3) 
        RETURNING id, email, name, created_at
      `
      const result = await db.query(insertQuery, [email, hashedPassword, name])
      const user = result.rows[0]

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "24h",
      })

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({
        success: false,
        error: "Registration failed",
        message: error.message,
      })
    }
  },
)

// Login endpoint
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { email, password } = req.body
      const db = req.app.locals.db

      // Find user
      const userQuery = "SELECT id, email, password, name FROM users WHERE email = $1"
      const result = await db.query(userQuery, [email])

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        })
      }

      const user = result.rows[0]

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "24h",
      })

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({
        success: false,
        error: "Login failed",
        message: error.message,
      })
    }
  },
)

module.exports = router
