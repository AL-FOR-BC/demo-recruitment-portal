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
exports.isMongoConnected = exports.disconnectMongoDB = exports.connectMongoDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
let isConnected = false;
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }
    try {
        if (!config_1.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        yield mongoose_1.default.connect(config_1.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        isConnected = false;
        throw error;
    }
});
exports.connectMongoDB = connectMongoDB;
const disconnectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!isConnected)
        return;
    try {
        yield mongoose_1.default.disconnect();
        isConnected = false;
        console.log("MongoDB disconnected");
    }
    catch (error) {
        console.error("MongoDB disconnection error:", error);
        throw error;
    }
});
exports.disconnectMongoDB = disconnectMongoDB;
const isMongoConnected = () => isConnected;
exports.isMongoConnected = isMongoConnected;
