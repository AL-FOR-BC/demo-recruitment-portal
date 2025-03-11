import cors from "cors";
import path from "path";
import express, { Application } from "express";
import { UserRoutes } from "../routes/UserRoutes";
import { ProfileRoutes } from "../routes/ProfileRoutes";

export default async (app: Application) => {
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use("/api/auth/", UserRoutes);
  // app.use("/api/user/", ProfileRoutes);
};
