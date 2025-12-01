export const PORT = process.env.PORT || 8001;
export const APP_SECRET = "Our_APP_Secret";

// Database configuration
export const DB_TYPE = (process.env.DB_TYPE || "prisma").toLowerCase(); // "prisma" or "mongoose"
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const MONGODB_URI =
  process.env.MONGODB_URI || process.env.DATABASE_URL || "";

// Environment
export const NODE_ENV = process.env.NODE_ENV || "development";
