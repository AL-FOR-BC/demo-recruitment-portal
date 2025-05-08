"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.profileValidation = {
    create: joi_1.default.object({
        first_name: joi_1.default.string().required(),
        last_name: joi_1.default.string().required(),
        middle_name: joi_1.default.string().allow("", null),
        mobile_no: joi_1.default.string().required(),
        birth_date: joi_1.default.date().required(),
        birth_district: joi_1.default.string().required(),
        district_of_origin: joi_1.default.string().required(),
        marital_status: joi_1.default.string().required(),
        nationality: joi_1.default.string().required(),
        passport_number: joi_1.default.string().allow("", null),
        national_id_number: joi_1.default.string().required(),
        gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER').required(),
        applicant_address: joi_1.default.string().required(),
        relative_in_organisation: joi_1.default.boolean().required(),
    }),
    update: joi_1.default.object({
        first_name: joi_1.default.string(),
        last_name: joi_1.default.string(),
        middle_name: joi_1.default.string().allow("", null),
        mobile_no: joi_1.default.string(),
        birth_date: joi_1.default.date(),
        birth_district: joi_1.default.string(),
        district_of_origin: joi_1.default.string(),
        marital_status: joi_1.default.string(),
        nationality: joi_1.default.string(),
        passport_number: joi_1.default.string().allow("", null),
        national_id_number: joi_1.default.string(),
        gender: joi_1.default.string().valid('MALE', 'FEMALE', 'OTHER'),
        applicant_address: joi_1.default.string(),
        relative_in_organisation: joi_1.default.boolean(),
    }),
};
