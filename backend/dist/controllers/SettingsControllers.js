"use strict";
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
exports.CreateOrUpdateSettings = exports.GetAllSettings = exports.GetSettings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Settings_1 = require("../models/Settings");
const getCompanyName_1 = require("../utils/getCompanyName");
/**
 * Get settings (logo and theme color) for the recruitment portal
 * This endpoint returns the company logo and theme color from settings
 */
const GetSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get settings - try to find by id if provided, otherwise get the first document
        const settingsId = req.query.id;
        let settings;
        // Try to find by ObjectId if provided and valid
        if (settingsId) {
            if (mongoose_1.default.Types.ObjectId.isValid(settingsId)) {
                settings = yield Settings_1.Settings.findById(settingsId);
            }
            else {
                // Try finding by string _id field
                settings = yield Settings_1.Settings.findOne({ _id: settingsId });
            }
        }
        // If no id provided or not found, get the first document in the collection
        if (!settings) {
            settings = yield Settings_1.Settings.findOne();
        }
        // If settings still don't exist, return defaults
        if (!settings) {
            res.status(200).json({
                success: true,
                data: {
                    companyLogo: null,
                    themeColor: "#094BAC",
                    companyName: null,
                    help: null,
                },
            });
            return;
        }
        // Return settings for the portal
        res.status(200).json({
            success: true,
            data: {
                companyLogo: settings.companyLogo || null,
                themeColor: settings.themeColor || "#094BAC",
                companyName: settings.companyName || null,
                help: settings.help || null,
            },
        });
    }
    catch (error) {
        console.error("GetSettings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: error.message || "Unknown error",
        });
    }
});
exports.GetSettings = GetSettings;
/**
 * Get all settings (including allowCompanyChange)
 * This is a more complete endpoint if you need all settings
 */
const GetAllSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get settings - try to find by id if provided, otherwise get the first document
        const settingsId = req.query.id;
        let settings;
        // Try to find by ObjectId if provided and valid
        if (settingsId) {
            if (mongoose_1.default.Types.ObjectId.isValid(settingsId)) {
                settings = yield Settings_1.Settings.findById(settingsId);
            }
            else {
                // Try finding by string _id field
                settings = yield Settings_1.Settings.findOne({ _id: settingsId });
            }
        }
        // If no id provided or not found, get the first document in the collection
        if (!settings) {
            settings = yield Settings_1.Settings.findOne();
        }
        if (!settings) {
            res.status(404).json({
                success: false,
                message: "Settings not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {
                allowCompanyChange: settings.allowCompanyChange,
                companyLogo: settings.companyLogo || null,
                themeColor: settings.themeColor || "#094BAC",
                companyName: settings.companyName || null,
                help: settings.help || null,
            },
        });
    }
    catch (error) {
        console.error("GetAllSettings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: error.message || "Unknown error",
        });
    }
});
exports.GetAllSettings = GetAllSettings;
/**
 * Create or update settings
 * POST /api/settings
 */
const CreateOrUpdateSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, allowCompanyChange, companyLogo, themeColor, companyName, help, } = req.body;
        // Validate required fields
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Settings id is required",
            });
            return;
        }
        // Check if settings with this id already exists
        let existingSettings;
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            existingSettings = yield Settings_1.Settings.findById(id);
        }
        else {
            existingSettings = yield Settings_1.Settings.findOne({ _id: id });
        }
        let settings;
        if (existingSettings) {
            // Update existing settings
            const updateData = {};
            if (allowCompanyChange !== undefined) {
                updateData.allowCompanyChange = allowCompanyChange;
            }
            if (companyLogo !== undefined) {
                updateData.companyLogo = companyLogo;
            }
            if (themeColor !== undefined) {
                updateData.themeColor = themeColor;
            }
            if (companyName !== undefined) {
                updateData.companyName = companyName;
            }
            if (help !== undefined) {
                updateData.help = help;
            }
            settings = yield Settings_1.Settings.findByIdAndUpdate(existingSettings._id, updateData, { new: true, upsert: false });
        }
        else {
            // Create new settings
            const settingsData = {
                _id: id,
                allowCompanyChange: allowCompanyChange !== null && allowCompanyChange !== void 0 ? allowCompanyChange : false,
                companyLogo: companyLogo || null,
                themeColor: themeColor || "#094BAC",
                companyName: companyName || null,
                help: help || null,
            };
            settings = new Settings_1.Settings(settingsData);
            yield settings.save();
        }
        // Clear company name cache when settings are updated
        (0, getCompanyName_1.clearCompanyNameCache)();
        if (!settings) {
            res.status(500).json({
                success: false,
                message: "Failed to save settings",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: existingSettings
                ? "Settings updated successfully"
                : "Settings created successfully",
            data: {
                id: settings._id,
                allowCompanyChange: settings.allowCompanyChange,
                companyLogo: settings.companyLogo || null,
                themeColor: settings.themeColor || "#094BAC",
                companyName: settings.companyName || null,
                help: settings.help || null,
            },
        });
    }
    catch (error) {
        console.error("CreateOrUpdateSettings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create or update settings",
            error: error.message || "Unknown error",
        });
    }
});
exports.CreateOrUpdateSettings = CreateOrUpdateSettings;
