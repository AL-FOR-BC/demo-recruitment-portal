"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userValidation = {
    signup: joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
        fullName: joi_1.default.string().required().min(3).messages({
            "string.min": "Full name must be at least 3 characters long",
            "any.required": "Full name is required",
        }),
        password: joi_1.default.string().required().min(6).messages({
            "string.min": "Password must be at least 6 characters long",
            "any.required": "Password is required",
        }),
    }),
    signin: joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
        password: joi_1.default.string().required().messages({
            "any.required": "Password is required",
        }),
    }),
    verify: joi_1.default.object({
        otp: joi_1.default.string().required().length(6).messages({
            "string.length": "OTP must be 6 characters long",
            "any.required": "OTP is required",
        }),
    }),
    resendOtp: joi_1.default.object({
        email: joi_1.default.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),
    }),
};
