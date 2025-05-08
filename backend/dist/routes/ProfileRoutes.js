"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = require("express");
const ProfileControllers_1 = require("../controllers/ProfileControllers");
const CommonAuth_1 = require("../middlewares/CommonAuth");
const ValidateRequest_1 = require("../middlewares/ValidateRequest");
const profileValidation_1 = require("../validations/profileValidation");
const router = (0, express_1.Router)();
exports.ProfileRoutes = router;
// All profile routes should be authenticated
router.use(CommonAuth_1.Authenticate);
// Profile routes with validation
router.post("/create-profile", (0, ValidateRequest_1.ValidateRequest)(profileValidation_1.profileValidation.create), ProfileControllers_1.CreateProfile);
router.patch("/update-profile", (0, ValidateRequest_1.ValidateRequest)(profileValidation_1.profileValidation.update), ProfileControllers_1.UpdateProfile);
router.get("/profile", ProfileControllers_1.GetUserProfile);
