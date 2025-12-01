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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCompanyNameCache = exports.getCompanyName = void 0;
const Settings_1 = require("../models/Settings");
let cachedCompanyName = null;
/**
 * Get company name from Settings collection
 * Caches the result to avoid repeated database queries
 * @returns Company name or "ROM" as fallback
 */
const getCompanyName = () => __awaiter(void 0, void 0, void 0, function* () {
    // Return cached value if available
    const cached = cachedCompanyName;
    if (cached) {
        return cached;
    }
    try {
        // Try to get settings - look for first document or one with id "main"
        let settings = yield Settings_1.Settings.findOne({ _id: "main" });
        if (!settings) {
            settings = yield Settings_1.Settings.findOne();
        }
        if (settings && settings.companyName) {
            const name = settings.companyName || "ROM";
            cachedCompanyName = name;
            return name;
        }
        // Fallback to "ROM" if no company name found
        cachedCompanyName = "ROM";
        return "ROM";
    }
    catch (error) {
        console.error("Error fetching company name:", error);
        // Fallback to "ROM" on error
        return "ROM";
    }
});
exports.getCompanyName = getCompanyName;
/**
 * Clear the cached company name (useful when settings are updated)
 */
const clearCompanyNameCache = () => {
    cachedCompanyName = null;
};
exports.clearCompanyNameCache = clearCompanyNameCache;
