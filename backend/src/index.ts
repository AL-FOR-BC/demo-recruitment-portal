import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
// Look for .env in the backend root directory
// Try multiple paths to support both dev (ts-node) and production (compiled) modes
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

import express from "express";
import { PORT, DB_TYPE } from "./config";
import App from "./services/ExpressApp";
import { disconnectMongoDB } from "./database";

const StartServer = async () => {
  const app = express();

  await App(app);

  const server = app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
    console.log(`Database type: ${DB_TYPE}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(async () => {
      console.log("HTTP server closed");
      if (DB_TYPE === "mongoose") {
        await disconnectMongoDB();
      }
      process.exit(0);
    });
  });
};

StartServer();
