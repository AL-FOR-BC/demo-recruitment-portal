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

    // Convert Mongoose document to plain object if needed
    let profileData: any;
    if (profile && typeof profile.toObject === "function") {
      // It's a Mongoose document, convert to plain object
      profileData = profile.toObject();
    } else if (profile && (profile as any)._doc) {
      // It's a Mongoose document with _doc property
      profileData = (profile as any)._doc;
    } else {
      // It's already a plain object (Prisma)
      profileData = profile;
    }

    // Map camelCase fields to snake_case if they exist
    const mappedProfile = {
      email: profileData.email || profileData.Email,
      first_name: profileData.first_name || profileData.firstName,
      middle_name: profileData.middle_name || profileData.middleName || "",
      last_name: profileData.last_name || profileData.lastName,
      gender: profileData.gender || profileData.Gender,
      applicant_address:
        profileData.applicant_address ||
        profileData.applicantAddress ||
        profileData.Address2,
      national_id_number:
        profileData.national_id_number ||
        profileData.nationalIdNumber ||
        profileData.NationalIdNumber,
      mobile_no:
        profileData.mobile_no ||
        profileData.mobileNo ||
        profileData.MobilePhoneNo,
      birth_date:
        profileData.birth_date ||
        profileData.birthDate ||
        profileData.DateOfBirth,
      birth_district:
        profileData.birth_district ||
        profileData.birthDistrict ||
        profileData.DistrictOfBirth,
      district_of_origin:
        profileData.district_of_origin ||
        profileData.districtOfOrigin ||
        profileData.DistrictOfOrigin,
      nationality: profileData.nationality || profileData.Nationality,
      passport_number:
        profileData.passport_number ||
        profileData.passportNumber ||
        profileData.PassportNo ||
        "",
      marital_status:
        profileData.marital_status ||
        profileData.maritalStatus ||
        profileData.MaritalStatus,
      relative_in_organisation:
        profileData.relative_in_organisation !== undefined
          ? profileData.relative_in_organisation
          : profileData.relativeInOrganisation !== undefined
          ? profileData.relativeInOrganisation
          : false,
      last_modified: profileData.last_modified || profileData.lastModified,
    };

    // Format birth_date if it exists
    if (mappedProfile.birth_date) {
      const birthDate =
        mappedProfile.birth_date instanceof Date
          ? mappedProfile.birth_date
          : new Date(mappedProfile.birth_date);
      mappedProfile.birth_date = birthDate.toISOString().split("T")[0];
    }

    res.status(200).json(mappedProfile);
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
