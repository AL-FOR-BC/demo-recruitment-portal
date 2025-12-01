"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
exports.SettingsRoutes = router;
// Get settings for recruitment portal (logo and theme color)
// GET /api/settings?id=main
router.get("/", controllers_1.GetSettings);
// Get all settings (complete settings object)
// GET /api/settings/all?id=main
router.get("/all", controllers_1.GetAllSettings);
// Create or update settings
// POST /api/settings
router.post("/", controllers_1.CreateOrUpdateSettings);
