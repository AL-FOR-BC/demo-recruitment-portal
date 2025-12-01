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
exports.GetUserProfile = exports.UpdateProfile = exports.CreateProfile = void 0;
const database_1 = require("../utils/database");
const CreateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.email)) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const db = (0, database_1.getDB)();
        const existingProfile = yield db.applicant_profile.findUnique({
            where: {
                email: user.email,
            },
        });
        if (existingProfile) {
            res.status(400).json({ message: "Profile already exists" });
            return;
        }
        const { first_name, last_name, middle_name, mobile_no, birth_date, birth_district, district_of_origin, marital_status, nationality, passport_number, national_id_number, gender, applicant_address, relative_in_organisation, } = req.body;
        const profile = yield db.applicant_profile.create({
            data: {
                email: user.email,
                first_name,
                last_name,
                middle_name,
                mobile_no,
                birth_date: new Date(birth_date),
                birth_district,
                district_of_origin,
                marital_status,
                nationality,
                passport_number,
                national_id_number,
                gender,
                applicant_address,
                relative_in_organisation,
                last_modified: new Date(),
            },
        });
        res.status(201).json(profile);
    }
    catch (error) {
        console.error("Create Profile Error:", error);
        res.status(500).json({ message: "Error creating profile" });
    }
});
exports.CreateProfile = CreateProfile;
const UpdateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.email)) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const db = (0, database_1.getDB)();
        const existingProfile = yield db.applicant_profile.findUnique({
            where: {
                email: user.email,
            },
        });
        if (!existingProfile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        const { first_name, last_name, middle_name, mobile_no, birth_date, birth_district, district_of_origin, marital_status, nationality, passport_number, national_id_number, gender, applicant_address, relative_in_organisation, } = req.body;
        const profile = yield db.applicant_profile.update({
            where: {
                email: user.email,
            },
            data: {
                first_name,
                last_name,
                middle_name,
                mobile_no,
                birth_date: birth_date ? new Date(birth_date) : undefined,
                birth_district,
                district_of_origin,
                marital_status,
                nationality,
                passport_number,
                national_id_number,
                gender,
                applicant_address,
                relative_in_organisation,
                last_modified: new Date(),
            },
        });
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
});
exports.UpdateProfile = UpdateProfile;
const GetUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.email)) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }
        const db = (0, database_1.getDB)();
        let profile;
        try {
            profile = yield db.applicant_profile.findUnique({
                where: {
                    email: user.email,
                },
            });
        }
        catch (dbError) {
            // If database query fails, check if it's a "not found" type error
            console.error("Database query error:", dbError);
            // Check for Prisma "not found" error (P2025)
            if ((dbError === null || dbError === void 0 ? void 0 : dbError.code) === "P2025") {
                res.status(404).json({ message: "Profile not found" });
                return;
            }
            // Check for Mongoose cast errors or other "not found" indicators
            if ((dbError === null || dbError === void 0 ? void 0 : dbError.name) === "CastError" ||
                (dbError instanceof Error &&
                    (dbError.message.includes("Record to find does not exist") ||
                        dbError.message.includes("not found") ||
                        dbError.message.includes("No document found")))) {
                res.status(404).json({ message: "Profile not found" });
                return;
            }
            // Re-throw if it's a real database error
            throw dbError;
        }
        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.status(200).json(Object.assign(Object.assign({}, profile), { birth_date: (_a = profile.birth_date) === null || _a === void 0 ? void 0 : _a.toISOString().split("T")[0] }));
    }
    catch (error) {
        console.error("Get Profile Error:", error);
        // Final check for "not found" errors
        if ((error === null || error === void 0 ? void 0 : error.code) === "P2025" ||
            (error === null || error === void 0 ? void 0 : error.name) === "CastError" ||
            (error instanceof Error &&
                (error.message.includes("Record to find does not exist") ||
                    error.message.includes("not found") ||
                    error.message.includes("No document found")))) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.status(500).json({ message: "Error fetching profile" });
    }
});
exports.GetUserProfile = GetUserProfile;
