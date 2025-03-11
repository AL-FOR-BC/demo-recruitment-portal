import { NextFunction, Request, Response } from "express";
import prisma from "../prismadb";

export const CreateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    try {
      const profile = await prisma.users.findUnique({
        where: {
          email: user.email,
        },
      });

      if (profile) {
        const {
          applicant_address,
          birth_date,
          birth_district,
          district_of_origin,
          email,
          first_name,
          last_name,
          marital_status,
          middle_name,
          mobile_no,
          nationality,
          passport_number,
          national_id_number,
          gender,
          relative_in_organisation,
        } = req.body;

        const createProfile = await prisma.applicant_profile.create({
          data: {
            applicant_address,
            birth_date: `${birth_date}T00:00:00.000Z`,
            birth_district,
            district_of_origin,
            email,
            first_name,
            last_name,
            marital_status,
            middle_name,
            mobile_no,
            gender,
            national_id_number,
            passport_number,
            nationality,
            last_modified: new Date(),
            relative_in_organisation,
          },
        });
        return res.status(201).json(createProfile);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
};

export const UpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  console.log(user);
  if (user) {
    try {
      const profile = await prisma.applicant_profile.findUnique({
        where: {
          email: user.email,
        },
      });
      if (profile) {
        const {
          applicant_address,
          birth_date,
          birth_district,
          district_of_origin,
          first_name,
          last_name,
          marital_status,
          middle_name,
          mobile_no,
          gender,
          relative_in_organisation,
          nationality,
          national_id_number,
        } = req.body;
        console.log(profile);
        const updateProfile = await prisma.applicant_profile.update({
          where: {
            email: user.email,
          },
          data: {
            applicant_address,
            birth_date: `${birth_date}T00:00:00.000Z`,
            birth_district,
            district_of_origin,
            first_name,
            last_name,
            marital_status,
            middle_name,
            mobile_no,
            gender,
            relative_in_organisation,
            nationality,
            national_id_number,
          },
        });
        return res.status(200).json(updateProfile);
      } else {
        return res.status(400).json({ message: "Profile not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
  }
};

export const GetUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    try {
      const profile = await prisma.applicant_profile.findUnique({
        where: {
          email: user.email,
        },
      });
      if (profile) {
        console.log(profile);
        console.log(profile.birth_date.toISOString().split("T")[0]);
        return res.status(200).json({
          ...profile,
          birth_date: profile.birth_date.toISOString().split("T")[0],
        });
      } else {
        return res.status(404).json({ message: "Profile not found" });
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};
