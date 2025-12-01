import { NextFunction, Response } from "express";
import { IDatabaseAdapter } from "../database";
import { getDatabaseAdapterSync } from "../database/factory";

export const isEmptyObject = (obj: any) => {
  return Object.entries(obj).length === 0;
};

export const checkDatabaseConnection = async (
  res: Response,
  next: NextFunction
) => {
  try {
    const db = getDatabaseAdapterSync();
    const isConnected = await db.checkConnection();
    
    if (!isConnected) {
      return res.status(500).json({ message: "Database connection failed" });
    }
    
    next();
  } catch (error) {
    console.error("Database connection check error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

