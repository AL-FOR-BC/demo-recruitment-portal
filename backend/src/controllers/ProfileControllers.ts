import { Request, Response, NextFunction } from "express";
import prisma from "../prismadb";
import { RequestHandler } from "express";

export const CreateProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.email) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const existingProfile = await prisma.applicant_profile.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingProfile) {
      res.status(400).json({ message: "Profile already exists" });
      return;
    }

    const {
      first_name,
      last_name,
      middle_name,
      mobile_no,
      birth_date,
      birth_district,
      district_of_origin,
      marital_status,
      nationality,
      passport_number,
      national_id_number,
      gender,
      applicant_address,
      relative_in_organisation,
    } = req.body;

    const profile = await prisma.applicant_profile.create({
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
  } catch (error) {
    console.error("Create Profile Error:", error);
    res.status(500).json({ message: "Error creating profile" });
  }
};

export const UpdateProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.email) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const existingProfile = await prisma.applicant_profile.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!existingProfile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const {
      first_name,
      last_name,
      middle_name,
      mobile_no,
      birth_date,
      birth_district,
      district_of_origin,
      marital_status,
      nationality,
      passport_number,
      national_id_number,
      gender,
      applicant_address,
      relative_in_organisation,
    } = req.body;

    const profile = await prisma.applicant_profile.update({
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
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const GetUserProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.email) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const profile = await prisma.applicant_profile.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(200).json({
      ...profile,
      birth_date: profile.birth_date?.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
