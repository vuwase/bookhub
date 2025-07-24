const errorHandler = (err, req, res, next) => {
  console.error("Error Handler:", err)

  // Default error
  let error = { ...err }
  error.message = err.message

  // Log error
  console.error(err.stack)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found"
    error = { message, statusCode: 404 }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered"
    error = { message, statusCode: 400 }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message)
    error = { message, statusCode: 400 }
  }

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case "23505": // Unique violation
        error = { message: "Duplicate entry", statusCode: 400 }
        break
      case "23503": // Foreign key violation
        error = { message: "Referenced record not found", statusCode: 400 }
        break
      case "42P01": // Undefined table
        error = { message: "Database table not found", statusCode: 500 }
        break
      default:
        error = { message: "Database error", statusCode: 500 }
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler
