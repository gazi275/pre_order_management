import { Server } from "http";
import config from "./config";
import app from "./app";
import redis from "./shared/redis";

let server: Server;

async function startServer() {
  server = app.listen(config.port, () => {
    console.log(`🚀 Server is running on port ${config.port}`);
  });
}

async function main() {
  await startServer();

  const exitHandler = async () => {
    try {
      await redis.quit();
      console.info("Redis disconnected.");
    } catch (err) {
      console.error("Error disconnecting Redis:", err);
    }
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    } else {
      process.exit(1);
    }
  };

  process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception: ", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection: ", error);
    exitHandler();
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    exitHandler();
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down gracefully...");
    exitHandler();
  });
}

main();
