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
exports.RecruitmentUser = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RecruitmentUserSchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: false,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        maxlength: 255,
    },
    otp_secret: {
        type: String,
        required: true,
        maxlength: 255,
    },
    otp_expiry: {
        type: Date,
        required: false,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    profile_created: {
        type: Boolean,
        required: true,
        default: false,
    },
    salt: {
        type: String,
        required: true,
        maxlength: 255,
    },
    resetToken: {
        type: String,
        required: false,
        select: false,
    },
    resetTokenExpiry: {
        type: Date,
        required: false,
    },
}, {
    timestamps: false,
    collection: "recruitment_user",
});
// Auto-increment id if not provided
RecruitmentUserSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Only auto-generate id for new documents
        if (this.isNew && (!this.id || this.id === 0)) {
            try {
                // Use the model constructor to query for max id
                const Model = this.constructor;
                // Get the maximum id from existing documents
                const maxUser = yield Model.findOne()
                    .sort({ id: -1 })
                    .select("id")
                    .lean();
                // Set id to max + 1, or 1 if no documents exist
                this.id = maxUser && maxUser.id ? maxUser.id + 1 : 1;
            }
            catch (error) {
                // If there's an error, default to 1
                console.error("Error auto-generating id:", (error === null || error === void 0 ? void 0 : error.message) || error);
                this.id = 1;
            }
        }
    });
});
// Export model after hook is defined
exports.RecruitmentUser = mongoose_1.default.model("RecruitmentUser", RecruitmentUserSchema);
