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
exports.ValidateOtp = exports.EncryptOtp = exports.GenerateOtp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const GenerateOtp = () => {
    let otp;
    do {
        otp = Math.floor(100000 + Math.random() * 900000);
    } while (otp.toString().length !== 6);
    const expiry = new Date();
    // after 30 minutes
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
// export const GeneratePassword = async (password: string, salt: string) => {
//   return await bcrypt.hash(password, salt);
// };
const EncryptOtp = (otp, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(otp, salt);
});
exports.EncryptOtp = EncryptOtp;
const ValidateOtp = (otp, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(otp, salt);
});
exports.ValidateOtp = ValidateOtp;
