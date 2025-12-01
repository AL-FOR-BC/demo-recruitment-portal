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
exports.MongooseAdapter = void 0;
const Users_1 = require("../models/Users");
const ApplicantProfile_1 = require("../models/ApplicantProfile");
const BcConfig_1 = require("../models/BcConfig");
const AppSetup_1 = require("../models/AppSetup");
const mongoose_1 = __importDefault(require("mongoose"));
class MongooseAdapter {
    constructor() {
        this.recruitment_user = {
            findUnique: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield Users_1.RecruitmentUser.findOne({ email: args.where.email });
            }),
            create: (args) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    // Convert Prisma-style data to Mongoose document
                    const userData = {
                        email: args.data.email,
                        fullname: args.data.fullname,
                        password: args.data.password,
                        salt: args.data.salt,
                        otp_secret: args.data.otp_secret,
                        otp_expiry: args.data.otp_expiry,
                        verified: (_a = args.data.verified) !== null && _a !== void 0 ? _a : false,
                        profile_created: (_b = args.data.profile_created) !== null && _b !== void 0 ? _b : false,
                        resetToken: args.data.resetToken,
                        resetTokenExpiry: args.data.resetTokenExpiry,
                    };
                    const user = new Users_1.RecruitmentUser(userData);
                    const savedUser = yield user.save();
                    return savedUser;
                }
                catch (error) {
                    console.error("MongooseAdapter create error:", error);
                    console.error("Error details:", {
                        message: error === null || error === void 0 ? void 0 : error.message,
                        name: error === null || error === void 0 ? void 0 : error.name,
                        errors: error === null || error === void 0 ? void 0 : error.errors,
                    });
                    throw error;
                }
            }),
            update: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield Users_1.RecruitmentUser.findOneAndUpdate({ email: args.where.email }, args.data, { new: true });
            }),
            updateById: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield Users_1.RecruitmentUser.findOneAndUpdate({ id: args.where.id }, args.data, {
                    new: true,
                });
            }),
            findById: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield Users_1.RecruitmentUser.findOne({ id: args.where.id });
            }),
        };
        this.applicant_profile = {
            findUnique: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield ApplicantProfile_1.ApplicantProfile.findOne({ email: args.where.email });
            }),
            create: (args) => __awaiter(this, void 0, void 0, function* () {
                // Use email as _id
                const profileData = {
                    _id: args.data.email,
                    email: args.data.email,
                    first_name: args.data.first_name,
                    middle_name: args.data.middle_name,
                    last_name: args.data.last_name,
                    gender: args.data.gender,
                    applicant_address: args.data.applicant_address,
                    national_id_number: args.data.national_id_number,
                    mobile_no: args.data.mobile_no,
                    birth_date: args.data.birth_date,
                    birth_district: args.data.birth_district,
                    district_of_origin: args.data.district_of_origin,
                    nationality: args.data.nationality,
                    passport_number: args.data.passport_number,
                    marital_status: args.data.marital_status,
                    relative_in_organisation: args.data.relative_in_organisation,
                    last_modified: args.data.last_modified || new Date(),
                };
                const profile = new ApplicantProfile_1.ApplicantProfile(profileData);
                return yield profile.save();
            }),
            update: (args) => __awaiter(this, void 0, void 0, function* () {
                const updateData = Object.assign({}, args.data);
                if (updateData.last_modified === undefined) {
                    updateData.last_modified = new Date();
                }
                return yield ApplicantProfile_1.ApplicantProfile.findByIdAndUpdate(args.where.email, updateData, { new: true });
            }),
        };
        this.bc_configs = {
            findUnique: (args) => __awaiter(this, void 0, void 0, function* () {
                return yield BcConfig_1.BcConfig.findById(args.where.id);
            }),
            findFirst: (args) => __awaiter(this, void 0, void 0, function* () {
                if (args === null || args === void 0 ? void 0 : args.where) {
                    return yield BcConfig_1.BcConfig.findOne(args.where);
                }
                return yield BcConfig_1.BcConfig.findOne();
            }),
        };
        this.app_setup = {
            findFirst: () => __awaiter(this, void 0, void 0, function* () {
                return yield AppSetup_1.AppSetup.findOne();
            }),
            create: (args) => __awaiter(this, void 0, void 0, function* () {
                const setupData = {
                    base_url: args.data.base_url,
                    default_company: args.data.default_company,
                    ehub_username: args.data.ehub_username,
                    ehub_pass: args.data.ehub_pass,
                    last_modified: args.data.last_modified || new Date(),
                    modified_by: args.data.modified_by,
                };
                const setup = new AppSetup_1.AppSetup(setupData);
                return yield setup.save();
            }),
            update: (args) => __awaiter(this, void 0, void 0, function* () {
                const updateData = Object.assign({}, args.data);
                if (updateData.last_modified === undefined) {
                    updateData.last_modified = new Date();
                }
                return yield AppSetup_1.AppSetup.findOneAndUpdate({ setup_id: args.where.setup_id }, updateData, { new: true });
            }),
        };
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const state = mongoose_1.default.connection.readyState;
                // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
                return state === 1;
            }
            catch (error) {
                console.error("Mongoose connection check failed:", error);
                return false;
            }
        });
    }
    queryRaw(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // For MongoDB, we can use mongoose.connection.db
            if (mongoose_1.default.connection.readyState === 1) {
                return yield ((_a = mongoose_1.default.connection.db) === null || _a === void 0 ? void 0 : _a.admin().ping());
            }
            throw new Error("MongoDB not connected");
        });
    }
}
exports.MongooseAdapter = MongooseAdapter;
