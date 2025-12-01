"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.MONGODB_URI = exports.DATABASE_URL = exports.DB_TYPE = exports.APP_SECRET = exports.PORT = void 0;
exports.PORT = process.env.PORT || 8001;
exports.APP_SECRET = "Our_APP_Secret";
// Database configuration
exports.DB_TYPE = (process.env.DB_TYPE || "prisma").toLowerCase(); // "prisma" or "mongoose"
exports.DATABASE_URL = process.env.DATABASE_URL || "";
exports.MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || "";
// Environment
exports.NODE_ENV = process.env.NODE_ENV || "development";
