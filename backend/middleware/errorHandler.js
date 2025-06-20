const errorHandler = (err, req, res, next) => {
  console.error(err.stack)

  // Default error
  let error = { ...err }
  error.message = err.message

  // PostgreSQL duplicate key error
  if (err.code === "23505") {
    const message = "Duplicate field value entered"
    error = { message, statusCode: 400 }
  }

  // PostgreSQL validation error
  if (err.code === "23502") {
    const message = "Required field missing"
    error = { message, statusCode: 400 }
  }

  // PostgreSQL foreign key constraint error
  if (err.code === "23503") {
    const message = "Resource not found"
    error = { message, statusCode: 404 }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
  })
}

module.exports = errorHandler
