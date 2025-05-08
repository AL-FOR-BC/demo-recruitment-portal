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
exports.ResendOtp = exports.UserSignIn = exports.UserVerify = exports.UserSignUp = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../dto");
const SendEmail_1 = require("../utils/SendEmail");
const PasswordUtility_1 = require("../utils/PasswordUtility");
const NotificationUtility_1 = require("../utils/NotificationUtility");
const prismadb_1 = __importDefault(require("../prismadb"));
const client_1 = require("@prisma/client");
// import { isEmptyObject } from "../helpers";
const isEmptyObject = (obj) => {
    return Object.entries(obj).length === 0;
};
const UserSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const userInputs = (0, class_transformer_1.plainToClass)(dto_1.UserInput, req.body);
        const validationError = yield (0, class_validator_1.validate)(userInputs, {
            validationError: { target: true },
        });
        if (validationError.length > 0) {
            res.status(400).json(validationError);
            return;
        }
        const { email, fullName, password } = userInputs;
        const salt = yield (0, PasswordUtility_1.GenerateSalt)();
        const userPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
        const { otp, expiry } = (0, NotificationUtility_1.GenerateOtp)();
        const otp_secret = otp.toString();
        const encryptedOtp = yield (0, NotificationUtility_1.EncryptOtp)(otp_secret, salt);
        const otp_expiry = expiry;
        const subject = "ROM E-Recruitment OTP";
        if (yield prismadb_1.default.users.findUnique({ where: { email } })) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = yield prismadb_1.default.users.create({
            data: {
                email,
                fullname: fullName,
                password: userPassword,
                salt,
                otp_secret: encryptedOtp,
                otp_expiry,
                verified: false,
            },
        });
        if (user) {
            yield (0, SendEmail_1.sendEmail)(email, subject, otp.toString(), fullName);
            const signature = yield (0, PasswordUtility_1.GenerateSignature)({
                id: user.id.toString(),
                email: user.email,
                verified: user.verified,
            });
            res.status(201).json({
                signature,
                verified: user.verified,
                email: user.email,
            });
            return;
        }
        else {
            res.status(400).json({ message: "User not created" });
            return;
        }
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                res.status(400).json({
                    message: "Email already exists",
                });
                return;
            }
        }
        res.status(500).json({
            message: "Something went wrong",
            error: e,
        });
        return;
    }
});
exports.UserSignUp = UserSignUp;
const UserVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const user = req.user;
    console.log("OTP:", otp);
    console.log("User:", user);
    if (!(user === null || user === void 0 ? void 0 : user.email)) {
        res.status(401).json({ message: "User email not found in token" });
        return;
    }
    try {
        const profile = yield prismadb_1.default.users.findUnique({
            where: {
                email: user.email, // Now we ensure email is defined
            },
        });
        if (!profile) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const otpValidation = yield (0, NotificationUtility_1.EncryptOtp)(otp.toString(), profile.salt);
        if (profile.otp_secret === otpValidation &&
            profile.otp_expiry &&
            profile.otp_expiry >= new Date()) {
            const updatedUserResponse = yield prismadb_1.default.users.update({
                where: {
                    email: user.email,
                },
                data: {
                    verified: true,
                },
            });
            const signature = yield (0, PasswordUtility_1.GenerateSignature)({
                id: updatedUserResponse.id.toString(),
                email: updatedUserResponse.email,
                verified: updatedUserResponse.verified,
            });
            res.status(200).json({
                signature,
                email: updatedUserResponse.email,
                verified: updatedUserResponse.verified,
            });
            return;
        }
        else {
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }
    }
    catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ message: "Error verifying user", error });
        return;
    }
});
exports.UserVerify = UserVerify;
const UserSignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        const profile = yield prismadb_1.default.users.findUnique({
            where: {
                email,
            },
        });
        if (profile) {
            const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, profile.password, profile.salt);
            if (validation) {
                if (profile.verified === false) {
                    const { otp, expiry } = (0, NotificationUtility_1.GenerateOtp)();
                    const otp_secret = otp.toString();
                    const encryptedOtp = yield (0, NotificationUtility_1.EncryptOtp)(otp_secret, profile.salt);
                    const otp_expiry = expiry;
                    const user = yield prismadb_1.default.users.update({
                        where: {
                            email: email,
                        },
                        data: {
                            otp_secret: encryptedOtp,
                            otp_expiry: otp_expiry,
                        },
                    });
                    yield (0, SendEmail_1.sendEmail)(email, user.fullname, `${otp}`, "Please verify your email to continue");
                    const signature = yield (0, PasswordUtility_1.GenerateSignature)({
                        id: profile.id.toString(),
                        email: profile.email,
                        verified: profile.verified,
                    });
                    res.status(403).json({
                        message: "User not verified",
                        signature,
                        verified: profile.verified,
                        code: "USER_UNVERIFIED",
                    });
                    return;
                }
                const config = yield prismadb_1.default.bc_configs.findUnique({
                    where: { id: "3" },
                });
                if (config) {
                    const signature = yield (0, PasswordUtility_1.GenerateSignature)({
                        id: profile.id.toString(),
                        email: profile.email,
                        verified: profile.verified,
                    });
                    res.status(200).json({
                        signature,
                        email: profile.email,
                        verified: profile.verified,
                        fullName: profile.fullname,
                        companyId: config.companyId,
                    });
                }
                else {
                }
                return;
            }
            else {
                res.status(401).json({ message: "Invalid Password" });
                return;
            }
        }
        else {
            res.status(401).json({ message: "User not found" });
            return;
        }
    }
    catch (error) {
        res.status(401).json({ message: "User not found" });
        return;
    }
});
exports.UserSignIn = UserSignIn;
const ResendOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (email) {
            const user = yield prismadb_1.default.users.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                const { otp, expiry } = (0, NotificationUtility_1.GenerateOtp)();
                const otp_secret = otp.toString();
                const encryptedOtp = yield (0, NotificationUtility_1.EncryptOtp)(otp_secret, user.salt);
                const otp_expiry = expiry;
                const userV1 = yield prismadb_1.default.users.update({
                    where: {
                        email: email,
                    },
                    data: {
                        otp_secret: encryptedOtp,
                        otp_expiry: otp_expiry,
                    },
                });
                yield (0, SendEmail_1.sendEmail)(email, userV1.fullname, "ROM E-Recruitment OTP", otp.toString());
                res.status(200).json({ message: "OTP sent" });
                return;
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: "User not found" });
        return;
    }
});
exports.ResendOtp = ResendOtp;
