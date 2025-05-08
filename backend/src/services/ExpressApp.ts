import cors from "cors";
import path from "path";
import express, { Application } from "express";
import { UserRoutes } from "../routes/UserRoutes";
import { ProfileRoutes } from "../routes/ProfileRoutes";
import { checkDatabaseConnection } from "../helpers";
import prisma from "../prismadb";

export default async (app: Application) => {
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use((req, res, next) => {
    console.log("Checking database connection");
    checkDatabaseConnection(prisma, res, next);
  });
  app.use("/api/auth/", UserRoutes);
  app.use("/api/profile/", ProfileRoutes);
};
