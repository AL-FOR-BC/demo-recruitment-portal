import mongoose from "mongoose";
import { MONGODB_URI } from "../config";

let isConnected = false;

export const connectMongoDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;
    throw error;
  }
};

export const disconnectMongoDB = async (): Promise<void> => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
    throw error;
  }
};

export const isMongoConnected = (): boolean => isConnected;
