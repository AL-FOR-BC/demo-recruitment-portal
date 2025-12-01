import { isEmpty, validate } from "class-validator";
import { plainToClass } from "class-transformer";
import e, { NextFunction, Request, Response } from "express";
import { UserInput } from "../dto";
import { sendEmail } from "../utils/SendEmail";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utils/PasswordUtility";
import {
  GenerateOtp,
  EncryptOtp,
  ValidateOtp,
} from "../utils/NotificationUtility";
import { getDB } from "../utils/database";
import { getCompanyName } from "../utils/getCompanyName";

export const UserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);
    const userInputs = plainToClass(UserInput, req.body);
    const validationError = await validate(userInputs, {
      validationError: { target: true },
    });

    if (validationError.length > 0) {
      res.status(400).json(validationError);
      return;
    }

    const { email, fullName, password } = userInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const otp_secret = otp.toString();
    const encryptedOtp = await EncryptOtp(otp_secret, salt);

    const otp_expiry = expiry;

    const companyName = await getCompanyName();
    const subject = `${companyName} E-Recruitment OTP`;

    const db = getDB();
    if (await db.recruitment_user.findUnique({ where: { email } })) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await db.recruitment_user.create({
      data: {
        email,
        fullname: fullName,
        password: userPassword,
        salt,
        otp_secret: encryptedOtp,
        otp_expiry,
        verified: false,
      },
    });
    if (user) {
      await sendEmail(email, subject, otp.toString(), fullName);
      const signature = await GenerateSignature({
        id: user.id.toString(),
        email: user.email,
        verified: user.verified,
      });

      res.status(201).json({
        signature,
        verified: user.verified,
        email: user.email,
      });
      return;
    } else {
      res.status(400).json({ message: "User not created" });
      return;
    }
  } catch (e: any) {
    console.error("UserSignUp error:", e);
    console.error("Error details:", {
      message: e.message,
      code: e.code,
      name: e.name,
      stack: e.stack,
    });

    // Handle duplicate key error (MongoDB) or Prisma unique constraint error
    if (e.code === "P2002" || e.code === 11000) {
      res.status(400).json({
        message: "Email already exists",
      });
      return;
    }

    // Handle Mongoose validation errors
    if (e.name === "ValidationError") {
      const validationErrors: any = {};
      if (e.errors) {
        Object.keys(e.errors).forEach((key) => {
          validationErrors[key] = e.errors[key].message;
        });
      }
      res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
      error: e.message || "Unknown error",
      errorName: e.name || "Error",
    });
    return;
  }
};

export const UserVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { otp } = req.body;
  const user = req.user;
  console.log("OTP:", otp);
  console.log("User:", user);

  if (!user?.email) {
    res.status(401).json({ message: "User email not found in token" });
    return;
  }

  try {
    const db = getDB();
    const profile = await db.recruitment_user.findUnique({
      where: {
        email: user.email, // Now we ensure email is defined
      },
    });

    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const otpValidation = await EncryptOtp(otp.toString(), profile.salt);
    if (
      profile.otp_secret === otpValidation &&
      profile.otp_expiry &&
      profile.otp_expiry >= new Date()
    ) {
      const updatedUserResponse = await db.recruitment_user.update({
        where: {
          email: user.email,
        },
        data: {
          verified: true,
        },
      });

      const signature = await GenerateSignature({
        id: updatedUserResponse.id.toString(),
        email: updatedUserResponse.email,
        verified: updatedUserResponse.verified,
      });

      res.status(200).json({
        signature,
        email: updatedUserResponse.email,
        verified: updatedUserResponse.verified,
      });
      return;
    } else {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error verifying user", error });
    return;
  }
};

export const UserSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  // console.log(req.body);

  try {
    const db = getDB();
    const profile = await db.recruitment_user.findUnique({
      where: {
        email,
      },
    });

    if (profile) {
      const validation = await ValidatePassword(
        password,
        profile.password,
        profile.salt
      );

      if (validation) {
        if (profile.verified === false) {
          const { otp, expiry } = GenerateOtp();
          const otp_secret = otp.toString();
          const encryptedOtp = await EncryptOtp(otp_secret, profile.salt);
          const otp_expiry = expiry;
          const user = await db.recruitment_user.update({
            where: {
              email: email,
            },
            data: {
              otp_secret: encryptedOtp,
              otp_expiry: otp_expiry,
            },
          });
          await sendEmail(
            email,
            user.fullname,
            `${otp}`,
            "Please verify your email to continue"
          );
          const signature = await GenerateSignature({
            id: profile.id.toString(),
            email: profile.email,
            verified: profile.verified,
          });
          res.status(403).json({
            message: "User not verified",
            signature,
            verified: profile.verified,
            code: "USER_UNVERIFIED",
          });
          return;
        }
        const config = await db.bc_configs.findUnique({
          where: { id: "1" },
        });
        if (config) {
          const signature = await GenerateSignature({
            id: profile.id.toString(),
            email: profile.email,
            verified: profile.verified,
          });

          res.status(200).json({
            signature,
            email: profile.email,
            verified: profile.verified,
            fullName: profile.fullname,
            companyId: config.companyId,
          });
        } else {
        }
        return;
      } else {
        res.status(403).json({ message: "Invalid Password" });
        return;
      }
    } else {
      res.status(403).json({ message: "User not found" });
      return;
    }
  } catch (error) {
    res.status(403).json({ message: "User not found" });
    return;
  }
};

export const ResendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const db = getDB();
    if (email) {
      const user = await db.recruitment_user.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        const { otp, expiry } = GenerateOtp();
        const otp_secret = otp.toString();
        const encryptedOtp = await EncryptOtp(otp_secret, user.salt);
        const otp_expiry = expiry;
        const userV1 = await db.recruitment_user.update({
          where: {
            email: email,
          },
          data: {
            otp_secret: encryptedOtp,
            otp_expiry: otp_expiry,
          },
        });
        const companyName = await getCompanyName();
        await sendEmail(
          email,
          userV1.fullname,
          `${companyName} E-Recruitment OTP`,
          otp.toString()
        );
        res.status(200).json({ message: "OTP sent" });
        return;
      }
    }
  } catch (error) {
    res.status(400).json({ message: "User not found" });
    return;
  }
};

export const ForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const db = getDB();
    const { email } = req.body;

    const user = await db.recruitment_user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Generate reset token
    const { otp, expiry } = GenerateOtp();

    const otp_secret = otp.toString();
    const encryptedOtp = await EncryptOtp(otp_secret, user.salt);

    const otp_expiry = expiry;

    const companyName = await getCompanyName();
    const subject = `${companyName} E-Recruitment Password Reset OTP`;

    await db.recruitment_user.update({
      where: { email },
      data: {
        otp_secret: encryptedOtp,
        otp_expiry: otp_expiry,
      },
    });

    await sendEmail(email, subject, otp.toString(), user.fullname);
    const signature = await GenerateSignature({
      id: user.id.toString(),
      email: user.email,
      verified: user.verified,
    });

    res.status(200).json({
      signature,
      email: user.email,
      message: "Password reset instructions sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Failed to process password reset request",
    });
  }
};

export const ResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const db = getDB();
    const { email, newPassword } = req.body;

    const user = await db.recruitment_user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    // Generate new password hash
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(newPassword, salt);

    // Update user password and clear reset token
    await db.recruitment_user.updateById({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        salt: salt,
      },
    });

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Failed to reset password",
    });
  }
};

export const VefiyOtpResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { otp } = req.body;
  const { email } = req.body;
  console.log("OTP:", otp);
  console.log("User:", email);
  try {
    const db = getDB();
    const profile = await db.recruitment_user.findUnique({
      where: {
        email: email, // Now we ensure email is defined
      },
    });

    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const otpValidation = await EncryptOtp(otp.toString(), profile.salt);
    if (
      profile.otp_secret === otpValidation &&
      profile.otp_expiry &&
      profile.otp_expiry >= new Date()
    ) {
      const updatedUserResponse = await db.recruitment_user.update({
        where: {
          email: email,
        },
        data: {
          verified: true,
        },
      });

      const signature = await GenerateSignature({
        id: updatedUserResponse.id.toString(),
        email: updatedUserResponse.email,
        verified: updatedUserResponse.verified,
      });

      res.status(200).json({
        signature,
        email: updatedUserResponse.email,
        verified: updatedUserResponse.verified,
      });
      return;
    } else {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Error verifying user", error });
    return;
  }
};
