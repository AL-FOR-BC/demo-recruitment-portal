import { Request, Response, NextFunction } from "express";
import { getDB } from "../utils/database";
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

    const db = getDB();
    const existingProfile = await db.applicant_profile.findUnique({
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

    const profile = await db.applicant_profile.create({
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

    const db = getDB();
    const existingProfile = await db.applicant_profile.findUnique({
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

    const profile = await db.applicant_profile.update({
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

    const db = getDB();
    let profile;
    try {
      profile = await db.applicant_profile.findUnique({
        where: {
          email: user.email,
        },
      });
    } catch (dbError: any) {
      // If database query fails, check if it's a "not found" type error
      console.error("Database query error:", dbError);
      // Check for Prisma "not found" error (P2025)
      if (dbError?.code === "P2025") {
        res.status(404).json({ message: "Profile not found" });
        return;
      }
      // Check for Mongoose cast errors or other "not found" indicators
      if (
        dbError?.name === "CastError" ||
        (dbError instanceof Error &&
          (dbError.message.includes("Record to find does not exist") ||
            dbError.message.includes("not found") ||
            dbError.message.includes("No document found")))
      ) {
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

    res.status(200).json({
      ...profile,
      birth_date: profile.birth_date?.toISOString().split("T")[0],
    });
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    // Final check for "not found" errors
    if (
      error?.code === "P2025" ||
      error?.name === "CastError" ||
      (error instanceof Error &&
        (error.message.includes("Record to find does not exist") ||
          error.message.includes("not found") ||
          error.message.includes("No document found")))
    ) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }
    res.status(500).json({ message: "Error fetching profile" });
  }
};
