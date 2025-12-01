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
exports.checkDatabaseConnection = exports.isEmptyObject = void 0;
const factory_1 = require("../database/factory");
const isEmptyObject = (obj) => {
    return Object.entries(obj).length === 0;
};
exports.isEmptyObject = isEmptyObject;
const checkDatabaseConnection = (res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = (0, factory_1.getDatabaseAdapterSync)();
        const isConnected = yield db.checkConnection();
        if (!isConnected) {
            return res.status(500).json({ message: "Database connection failed" });
        }
        next();
    }
    catch (error) {
        console.error("Database connection check error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkDatabaseConnection = checkDatabaseConnection;
