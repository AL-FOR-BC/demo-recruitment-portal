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
exports.initializeDatabase = exports.getDatabaseAdapterSync = exports.getDatabaseAdapter = void 0;
const prisma_adapter_1 = require("./prisma.adapter");
const mongoose_adapter_1 = require("./mongoose.adapter");
const config_1 = require("../config");
const connection_1 = require("./connection");
let adapterInstance = null;
const getDatabaseAdapter = () => __awaiter(void 0, void 0, void 0, function* () {
    if (adapterInstance) {
        return adapterInstance;
    }
    if (config_1.DB_TYPE === "mongoose") {
        console.log("Initializing MongoDB adapter...");
        // Ensure MongoDB is connected
        yield (0, connection_1.connectMongoDB)();
        adapterInstance = new mongoose_adapter_1.MongooseAdapter();
    }
    else {
        console.log("Initializing Prisma adapter...");
        adapterInstance = new prisma_adapter_1.PrismaAdapter();
    }
    return adapterInstance;
});
exports.getDatabaseAdapter = getDatabaseAdapter;
const getDatabaseAdapterSync = () => {
    if (!adapterInstance) {
        throw new Error("Database adapter not initialized. Call getDatabaseAdapter() first.");
    }
    return adapterInstance;
};
exports.getDatabaseAdapterSync = getDatabaseAdapterSync;
// Initialize adapter on module load if DB_TYPE is set
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.getDatabaseAdapter)();
});
exports.initializeDatabase = initializeDatabase;
