import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Settings } from "../models/Settings";
import { clearCompanyNameCache } from "../utils/getCompanyName";

/**
 * Get settings (logo and theme color) for the recruitment portal
 * This endpoint returns the company logo and theme color from settings
 */
export const GetSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get settings - try to find by id if provided, otherwise get the first document
    const settingsId = req.query.id as string;

    let settings;

    // Try to find by ObjectId if provided and valid
    if (settingsId) {
      if (mongoose.Types.ObjectId.isValid(settingsId)) {
        settings = await Settings.findById(settingsId);
      } else {
        // Try finding by string _id field
        settings = await Settings.findOne({ _id: settingsId });
      }
    }

    // If no id provided or not found, get the first document in the collection
    if (!settings) {
      settings = await Settings.findOne();
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
        companyLogo: (settings as any).companyLogo || null,
        themeColor: settings.themeColor || "#094BAC",
        companyName: (settings as any).companyName || null,
        help: (settings as any).help || null,
      },
    });
  } catch (error: any) {
    console.error("GetSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message || "Unknown error",
    });
  }
};

/**
 * Get all settings (including allowCompanyChange)
 * This is a more complete endpoint if you need all settings
 */
export const GetAllSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get settings - try to find by id if provided, otherwise get the first document
    const settingsId = req.query.id as string;

    let settings;

    // Try to find by ObjectId if provided and valid
    if (settingsId) {
      if (mongoose.Types.ObjectId.isValid(settingsId)) {
        settings = await Settings.findById(settingsId);
      } else {
        // Try finding by string _id field
        settings = await Settings.findOne({ _id: settingsId });
      }
    }

    // If no id provided or not found, get the first document in the collection
    if (!settings) {
      settings = await Settings.findOne();
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
        companyName: (settings as any).companyName || null,
        help: (settings as any).help || null,
      },
    });
  } catch (error: any) {
    console.error("GetAllSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message || "Unknown error",
    });
  }
};

/**
 * Create or update settings
 * POST /api/settings
 */
export const CreateOrUpdateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      id,
      allowCompanyChange,
      companyLogo,
      themeColor,
      companyName,
      help,
    } = req.body;

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
    if (mongoose.Types.ObjectId.isValid(id)) {
      existingSettings = await Settings.findById(id);
    } else {
      existingSettings = await Settings.findOne({ _id: id });
    }

    let settings;

    if (existingSettings) {
      // Update existing settings
      const updateData: any = {};

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

      settings = await Settings.findByIdAndUpdate(
        existingSettings._id,
        updateData,
        { new: true, upsert: false }
      );
    } else {
      // Create new settings
      const settingsData = {
        _id: id,
        allowCompanyChange: allowCompanyChange ?? false,
        companyLogo: companyLogo || null,
        themeColor: themeColor || "#094BAC",
        companyName: companyName || null,
        help: help || null,
      };

      settings = new Settings(settingsData);
      await settings.save();
    }

    // Clear company name cache when settings are updated
    clearCompanyNameCache();

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
        companyName: (settings as any).companyName || null,
        help: (settings as any).help || null,
      },
    });
  } catch (error: any) {
    console.error("CreateOrUpdateSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create or update settings",
      error: error.message || "Unknown error",
    });
  }
};
