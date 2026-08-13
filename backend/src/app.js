const express = require("express");
const requestLogger = require("./middlewares/requestLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pino HTTP Request Logger
app.use(requestLogger);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});


// Global Error Handler 
app.use(errorHandler);

module.exports = app;