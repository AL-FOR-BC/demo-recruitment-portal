import { Router } from "express";
import {
  GetSettings,
  GetAllSettings,
  CreateOrUpdateSettings,
} from "../controllers";

const router = Router();

// Get settings for recruitment portal (logo and theme color)
// GET /api/settings?id=main
router.get("/", GetSettings);

// Get all settings (complete settings object)
// GET /api/settings/all?id=main
router.get("/all", GetAllSettings);

// Create or update settings
// POST /api/settings
router.post("/", CreateOrUpdateSettings);

export { router as SettingsRoutes };
