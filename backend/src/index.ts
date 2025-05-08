import express from "express";
import { PORT } from "./config";
import App from "./services/ExpressApp";
import { checkDatabaseConnection } from "./helpers";
import prisma from "./prismadb";

const StartServer = async () => {
  const app = express();

  //   await dbConnection();

  await App(app);
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });

 
};

StartServer();
