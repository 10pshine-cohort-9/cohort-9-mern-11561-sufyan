require("dotenv").config(); 
const app = require("./app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");

const rawPort = process.env.PORT ?? "5000";
const PORT = Number(rawPort);

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const startServer = async () => {
  // Connect to the database first
  await connectDB();

  // Start the server and retain the instance
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });

  // Listen for server-level errors (e.g., EADDRINUSE)
  server.on("error", (error) => {
    logger.error(`Server startup error: ${error.message}`);
    process.exit(1);
  });
};

// Handle any unhandled promise rejections during startup
startServer().catch((error) => {
  logger.error(`Failed to initialize application: ${error.message}`);
  process.exit(1);
});