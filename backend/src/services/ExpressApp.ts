import cors from "cors";
import path from "path";
import express, { Application } from "express";
import { UserRoutes } from "../routes/UserRoutes";
import { ProfileRoutes } from "../routes/ProfileRoutes";
import { SettingsRoutes } from "../routes/SettingsRoutes";
import { checkDatabaseConnection } from "../helpers";
import { initializeDatabase } from "../database";

export default async (app: Application) => {
  // Initialize database adapter
  await initializeDatabase();

  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true }));
  // allow any origin
  app.use(cors({ origin: "*" }));
  app.use((req, res, next) => {
    console.log("Checking database connection");
    checkDatabaseConnection(res, next);
  });
  app.use("/api/auth/", UserRoutes);
  app.use("/api/profile/", ProfileRoutes);
  app.use("/api/settings/", SettingsRoutes);
};
