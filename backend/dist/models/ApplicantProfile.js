"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ApplicantProfileSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
        lowercase: true,
        trim: true,
    },
    first_name: {
        type: String,
        required: true,
        maxlength: 60,
    },
    middle_name: {
        type: String,
        required: false,
        maxlength: 60,
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 60,
    },
    gender: {
        type: String,
        required: true,
        maxlength: 60,
    },
    applicant_address: {
        type: String,
        required: false,
        maxlength: 255,
    },
    national_id_number: {
        type: String,
        required: true,
        maxlength: 50,
    },
    mobile_no: {
        type: String,
        required: true,
        maxlength: 60,
    },
    birth_date: {
        type: Date,
        required: true,
    },
    birth_district: {
        type: String,
        required: false,
        maxlength: 50,
    },
    district_of_origin: {
        type: String,
        required: false,
        maxlength: 50,
    },
    nationality: {
        type: String,
        required: true,
        maxlength: 50,
    },
    passport_number: {
        type: String,
        required: false,
        maxlength: 60,
    },
    marital_status: {
        type: String,
        required: true,
        maxlength: 60,
    },
    relative_in_organisation: {
        type: Boolean,
        required: true,
    },
    last_modified: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, {
    timestamps: false,
    collection: "applicant_profile",
    _id: true,
});
// Set _id to email before saving
ApplicantProfileSchema.pre("save", function (next) {
    if (!this._id && this.email) {
        this._id = this.email;
    }
    next();
});
exports.ApplicantProfile = mongoose_1.default.model("ApplicantProfile", ApplicantProfileSchema);
