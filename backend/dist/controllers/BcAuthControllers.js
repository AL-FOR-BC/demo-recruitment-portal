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
exports.GetBcConfig = exports.BCAuthToken = void 0;
// import { prisma } from "../utils/Prismadb";
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../utils/database");
const BCAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, database_1.getDB)();
        const config = yield db.bc_configs.findUnique({
            where: { id: "2" },
        });
        console.log(config);
        if (!config) {
            return res.status(404).json({ error: "Configuration not found" });
        }
        const { tenant, clientSecret, clientId } = config;
        const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
        const data = new URLSearchParams({
            scope: "https://api.businesscentral.dynamics.com/.default",
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
        });
        const response = yield axios_1.default.post(url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return res.json(response.data);
    }
    catch (e) {
        console.error("Error fetching token:", e);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching the token" });
    }
});
exports.BCAuthToken = BCAuthToken;
const GetBcConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, database_1.getDB)();
        const config = yield db.bc_configs.findUnique({
            where: { id: "2" },
        });
        return res.json(config);
    }
    catch (e) {
        console.error("Error fetching config:", e);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching the config" });
    }
});
exports.GetBcConfig = GetBcConfig;
