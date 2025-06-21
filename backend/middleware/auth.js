const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
        hint: "To access this endpoint, you need to login first at POST /api/auth/login",
        public_endpoints: [
          "GET /api/books",
          "GET /api/books/:id",
          "GET /api/books/stats/summary",
          "POST /api/auth/register",
          "POST /api/auth/login",
        ],
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid token.",
      hint: "Your token may have expired. Please login again at POST /api/auth/login",
    })
  }
}

module.exports = auth
