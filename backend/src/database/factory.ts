import { IDatabaseAdapter } from "./adapter.interface";
import { PrismaAdapter } from "./prisma.adapter";
import { MongooseAdapter } from "./mongoose.adapter";
import { DB_TYPE } from "../config";
import { connectMongoDB } from "./connection";

let adapterInstance: IDatabaseAdapter | null = null;

export const getDatabaseAdapter = async (): Promise<IDatabaseAdapter> => {
  if (adapterInstance) {
    return adapterInstance;
  }

  if (DB_TYPE === "mongoose") {
    console.log("Initializing MongoDB adapter...");
    // Ensure MongoDB is connected
    await connectMongoDB();
    adapterInstance = new MongooseAdapter();
  } else {
    console.log("Initializing Prisma adapter...");
    adapterInstance = new PrismaAdapter();
  }

  return adapterInstance;
};

export const getDatabaseAdapterSync = (): IDatabaseAdapter => {
  if (!adapterInstance) {
    throw new Error(
      "Database adapter not initialized. Call getDatabaseAdapter() first."
    );
  }
  return adapterInstance;
};

// Initialize adapter on module load if DB_TYPE is set
export const initializeDatabase = async (): Promise<IDatabaseAdapter> => {
  return await getDatabaseAdapter();
};
