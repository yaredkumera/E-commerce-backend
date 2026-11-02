import ApiError from "../utils/ApiError.js"

function ErrorHandler(error, req, res, next) {
  // If a response was already started, let Express finish it
  if (res.headersSent) {
    return next(error)
  }

  // 1. Errors you threw on purpose
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    })
  }

  // 2. Invalid value Mongoose cannot convert (bad ObjectId, text instead of number)
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for "${error.path}"`,
    })
  }

  // 3. Duplicate value in a unique index
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Already exists",
    })
  }

  // 4. Mongoose schema validation failed
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    })
  }

  // 5. Bad, missing or expired token
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }

  // 6. Broken JSON sent by the client
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
    })
  }

  // 7. Unknown error: log everything, tell the client nothing
  console.error(error)
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  })
}

export default ErrorHandler