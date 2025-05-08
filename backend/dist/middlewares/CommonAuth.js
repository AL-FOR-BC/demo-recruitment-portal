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
exports.Authenticate = void 0;
const PasswordUtility_1 = require("../utils/PasswordUtility");
const Authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = yield (0, PasswordUtility_1.ValidateSignature)(req);
        if (payload && typeof payload !== "boolean") {
            req.user = payload;
            console.log("Authenticated user:", req.user);
            next();
            return;
        }
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
});
exports.Authenticate = Authenticate;
