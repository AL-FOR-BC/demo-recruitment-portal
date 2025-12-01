import { Router, Request, Response, NextFunction } from "express";
import {
  GetUserProfile,
  ResendOtp,
  UserSignIn,
  UserSignUp,
  UserVerify,
  ForgotPassword,
  ResetPassword,
  VefiyOtpResetPassword,
} from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";
import { ValidateRequest } from "../middlewares/ValidateRequest";
import { userValidation } from "../validations/userValidation";
import { BCAuthToken } from "../controllers/BcAuthControllers";

const router = Router();

router.post("/sign-up", ValidateRequest(userValidation.signup), UserSignUp);

router.post("/sign-in", ValidateRequest(userValidation.signin), UserSignIn);

router.post("/forgot-password", ForgotPassword);

router.post("/verify-reset-password", VefiyOtpResetPassword);

router.post("/reset-password", ResetPassword);
router.use(Authenticate);

router.post("/verify", ValidateRequest(userValidation.verify), UserVerify);

router.get("/token", BCAuthToken)

router.post(
  "/resend-otp",
  ValidateRequest(userValidation.resendOtp),
  ResendOtp
);

router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);

export { router as UserRoutes };
