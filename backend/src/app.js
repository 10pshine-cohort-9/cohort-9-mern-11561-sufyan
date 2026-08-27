const express = require("express");

const requestLogger = require("./middlewares/requestLogger");

const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use("/api/users", authRoutes);

app.use(errorHandler);

module.exports = app;