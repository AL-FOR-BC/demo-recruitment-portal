import { Router, Request, Response, NextFunction } from "express";
import {
  GetUserProfile,
  ResendOtp,
  UserSignIn,
  UserSignUp,
  UserVerify,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { userValidation } from "../validations/userValidation";

const router = Router();

router.post("/signup", ValidateRequest(userValidation.signup), UserSignUp);

router.post("/signin", ValidateRequest(userValidation.signin), UserSignIn);

router.use(Authenticate);

router.post("/verify", ValidateRequest(userValidation.verify), UserVerify);

router.post(
  "/resend-otp",
  ValidateRequest(userValidation.resendOtp),
  ResendOtp
);

export { router as UserRoutes };
