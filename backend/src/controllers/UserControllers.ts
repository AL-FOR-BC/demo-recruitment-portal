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
import prisma from "../prismadb";
import { Prisma } from "@prisma/client";
// import { isEmptyObject } from "../helpers";
const isEmptyObject = (obj: any) => {
  return Object.entries(obj).length === 0;
};

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

    const { email, fullname, password } = userInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    const otp_secret = otp.toString();
    const encryptedOtp = await EncryptOtp(otp_secret, salt);

    const otp_expiry = expiry;

    const subject = "ROM E-Recruitment OTP";

    if (await prisma.users.findUnique({ where: { email } })) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await prisma.users.create({
      data: {
        email,
        fullname,
        password: userPassword,
        salt,
        otp_secret: encryptedOtp,
        otp_expiry,
        verified: false,
      },
    });
    if (user) {
      await sendEmail(email, subject, otp.toString(), fullname);
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        res.status(400).json({
          message: "Email already exists",
        });
        return;
      }
    }
    res.status(500).json({
      message: "Something went wrong",
      error: e,
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
    const profile = await prisma.users.findUnique({
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
      const updatedUserResponse = await prisma.users.update({
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
    const profile = await prisma.users.findUnique({
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
          const user = await prisma.users.update({
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
            "ROM E-Recruitment OTP",
            "Please verify your email to continue"
          );
          const signature = await GenerateSignature({
            id: profile.id.toString(),
            email: profile.email,
            verified: profile.verified,
          });
          res.status(400).json({ message: "User not verified", signature });
          return;
        }

        const signature = await GenerateSignature({
          id: profile.id.toString(),
          email: profile.email,
          verified: profile.verified,
        });

        res.status(200).json({
          signature,
          email: profile.email,
          verified: profile.verified,
        });
        return;
      } else {
        res.status(400).json({ message: "Invalid Password" });
        return;
      }
    } else {
      res.status(400).json({ message: "User not found" });
      return;
    }
  } catch (error) {
    res.status(400).json({ message: "User not found" });
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

    if (email) {
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (user) {
        const { otp, expiry } = GenerateOtp();
        const otp_secret = otp.toString();
        const encryptedOtp = await EncryptOtp(otp_secret, user.salt);
        const otp_expiry = expiry;
        const userV1 = await prisma.users.update({
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
          userV1.fullname,
          "ROM E-Recruitment OTP",
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
