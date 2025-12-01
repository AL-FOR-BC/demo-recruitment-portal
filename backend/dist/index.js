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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
// Look for .env in the backend root directory
// Try multiple paths to support both dev (ts-node) and production (compiled) modes
const envPath = path_1.default.resolve(process.cwd(), ".env");
dotenv_1.default.config({ path: envPath });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
const database_1 = require("./database");
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    yield (0, ExpressApp_1.default)(app);
    const server = app.listen(config_1.PORT, () => {
        console.log(`Listening to port ${config_1.PORT}`);
        console.log(`Database type: ${config_1.DB_TYPE}`);
    });
    // Graceful shutdown
    process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("SIGTERM signal received: closing HTTP server");
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log("HTTP server closed");
            if (config_1.DB_TYPE === "mongoose") {
                yield (0, database_1.disconnectMongoDB)();
            }
            process.exit(0);
        }));
    }));
});
StartServer();
