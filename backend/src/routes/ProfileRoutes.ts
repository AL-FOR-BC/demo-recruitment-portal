import { Router } from "express";
import {
  CreateProfile,
  UpdateProfile,
  GetUserProfile,
} from "../controllers/ProfileControllers";
import { Authenticate } from "../middlewares/CommonAuth";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { profileValidation } from "../validations/profileValidation";

const router = Router();

// All profile routes should be authenticated
router.use(Authenticate);

// Profile routes with validation
router.post(
  "/create-profile",
  ValidateRequest(profileValidation.create),
  CreateProfile
);

router.patch(
  "/update-profile",
  ValidateRequest(profileValidation.update),
  UpdateProfile
);

router.get("/profile", GetUserProfile);

export { router as ProfileRoutes };
