require("dotenv").config();
const path = require("path");
const express = require("express");
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const rawPort = process.env.PORT ?? "5000";
const PORT = Number(rawPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });

    server.on("error", (error) => {
      logger.error(`Server startup error: ${error.message}`);
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to initialize application: ${error.message}`);
    process.exit(1);
  }
};

startServer().catch((error) => {
  logger.error(`Failed to initialize application: ${error.message}`);
  process.exit(1);
});