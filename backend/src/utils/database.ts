import { IDatabaseAdapter } from "../database";
import { getDatabaseAdapterSync } from "../database/factory";

// Utility to get the database adapter instance
// This is used by controllers to access the database
export const getDB = (): IDatabaseAdapter => {
  return getDatabaseAdapterSync();
};

