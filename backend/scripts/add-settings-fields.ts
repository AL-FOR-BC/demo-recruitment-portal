/**
 * Migration script to add companyName and help fields to existing Settings documents
 *
 * Run with: npx ts-node scripts/add-settings-fields.ts
 * Or: npm run migrate:settings
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Settings } from "../src/models/Settings";

// Load environment variables
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || "";

async function migrateSettings() {
  try {
    // Connect to MongoDB
    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI or DATABASE_URL not found in environment variables"
      );
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    // Find all settings documents
    const allSettings = await Settings.find({});

    if (allSettings.length === 0) {
      console.log("No settings documents found. Nothing to migrate.");
      await mongoose.disconnect();
      return;
    }

    console.log(`Found ${allSettings.length} settings document(s)`);

    let updatedCount = 0;

    // Update each document that doesn't have the new fields
    for (const setting of allSettings) {
      let needsUpdate = false;
      const updateData: any = {};

      // Check if companyName is missing or null/undefined
      if (!setting.companyName && (setting as any).companyName === undefined) {
        updateData.companyName = null;
        needsUpdate = true;
      }

      // Check if help is missing or null/undefined
      if (!setting.help && (setting as any).help === undefined) {
        updateData.help = null;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Settings.findByIdAndUpdate(setting._id, {
          $set: updateData,
        });
        updatedCount++;
        console.log(`Updated settings document: ${setting._id}`);
      } else {
        console.log(`Settings document ${setting._id} already has all fields`);
      }
    }

    console.log(`\nMigration complete! Updated ${updatedCount} document(s).`);

    // Disconnect
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

// Run migration
migrateSettings()
  .then(() => {
    console.log("Migration finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });



