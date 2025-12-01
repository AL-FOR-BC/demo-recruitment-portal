import mongoose from "mongoose";
import { Settings } from "../models/Settings";

let cachedCompanyName: string | null = null;

/**
 * Get company name from Settings collection
 * Caches the result to avoid repeated database queries
 * @returns Company name or "ROM" as fallback
 */
export const getCompanyName = async (): Promise<string> => {
  // Return cached value if available
  const cached = cachedCompanyName;
  if (cached) {
    return cached;
  }

  try {
    // Try to get settings - look for first document or one with id "main"
    let settings = await Settings.findOne({ _id: "main" });

    if (!settings) {
      settings = await Settings.findOne();
    }

    if (settings && (settings as any).companyName) {
      const name = (settings as any).companyName || "ROM";
      cachedCompanyName = name;
      return name;
    }

    // Fallback to "ROM" if no company name found
    cachedCompanyName = "ROM";
    return "ROM";
  } catch (error) {
    console.error("Error fetching company name:", error);
    // Fallback to "ROM" on error
    return "ROM";
  }
};

/**
 * Clear the cached company name (useful when settings are updated)
 */
export const clearCompanyNameCache = (): void => {
  cachedCompanyName = null;
};
