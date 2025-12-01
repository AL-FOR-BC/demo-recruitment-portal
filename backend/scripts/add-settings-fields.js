"use strict";
/**
 * Migration script to add companyName and help fields to existing Settings documents
 *
 * Run with: npx ts-node scripts/add-settings-fields.ts
 * Or: npm run migrate:settings
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Settings_1 = require("../src/models/Settings");
// Load environment variables
const envPath = path_1.default.resolve(process.cwd(), ".env");
dotenv_1.default.config({ path: envPath });
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || "";
function migrateSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            if (!MONGODB_URI) {
                throw new Error("MONGODB_URI or DATABASE_URL not found in environment variables");
            }
            console.log("Connecting to MongoDB...");
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log("Connected to MongoDB successfully");
            // Find all settings documents
            const allSettings = yield Settings_1.Settings.find({});
            if (allSettings.length === 0) {
                console.log("No settings documents found. Nothing to migrate.");
                yield mongoose_1.default.disconnect();
                return;
            }
            console.log(`Found ${allSettings.length} settings document(s)`);
            let updatedCount = 0;
            // Update each document that doesn't have the new fields
            for (const setting of allSettings) {
                let needsUpdate = false;
                const updateData = {};
                // Check if companyName is missing or null/undefined
                if (!setting.companyName && setting.companyName === undefined) {
                    updateData.companyName = null;
                    needsUpdate = true;
                }
                // Check if help is missing or null/undefined
                if (!setting.help && setting.help === undefined) {
                    updateData.help = null;
                    needsUpdate = true;
                }
                if (needsUpdate) {
                    yield Settings_1.Settings.findByIdAndUpdate(setting._id, {
                        $set: updateData,
                    });
                    updatedCount++;
                    console.log(`Updated settings document: ${setting._id}`);
                }
                else {
                    console.log(`Settings document ${setting._id} already has all fields`);
                }
            }
            console.log(`\nMigration complete! Updated ${updatedCount} document(s).`);
            // Disconnect
            yield mongoose_1.default.disconnect();
            console.log("Disconnected from MongoDB");
        }
        catch (error) {
            console.error("Migration error:", error);
            process.exit(1);
        }
    });
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
