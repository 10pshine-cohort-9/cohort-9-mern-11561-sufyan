const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : res.statusCode >= 400 && res.statusCode <= 599
        ? res.statusCode
        : 500;

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