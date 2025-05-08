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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = require("../routes/UserRoutes");
const ProfileRoutes_1 = require("../routes/ProfileRoutes");
const helpers_1 = require("../helpers");
const prismadb_1 = __importDefault(require("../prismadb"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json({ limit: "30mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
    app.use((req, res, next) => {
        console.log("Checking database connection");
        (0, helpers_1.checkDatabaseConnection)(prismadb_1.default, res, next);
    });
    app.use("/api/auth/", UserRoutes_1.UserRoutes);
    app.use("/api/profile/", ProfileRoutes_1.ProfileRoutes);
});
