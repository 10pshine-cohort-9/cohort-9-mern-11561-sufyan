const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  let statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : res.statusCode >= 400 && res.statusCode <= 599
        ? res.statusCode
        : 500;

  // Map Mongoose validation, cast, duplicate, or file upload errors to 400 Bad Request
  if (
    err.name === "ValidationError" || 
    err.name === "CastError" || 
    err.code === 11000 || 
    err.code === "LIMIT_FILE_SIZE" ||
    (err.message && (err.message.includes("image files") || err.message.includes("file type")))
  ) {
    statusCode = 400;
  }

  const message =
    statusCode >= 500 ? "Internal Server Error" : err.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;