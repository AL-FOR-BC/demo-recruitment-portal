import { IDatabaseAdapter } from "./adapter.interface";
import { RecruitmentUser } from "../models/Users";
import { ApplicantProfile } from "../models/ApplicantProfile";
import { BcConfig } from "../models/BcConfig";
import { AppSetup } from "../models/AppSetup";
import mongoose from "mongoose";

export class MongooseAdapter implements IDatabaseAdapter {
  recruitment_user = {
    findUnique: async (args: { where: { email: string } }) => {
      return await RecruitmentUser.findOne({ email: args.where.email });
    },
    create: async (args: { data: any }) => {
      try {
        // Convert Prisma-style data to Mongoose document
        const userData = {
          email: args.data.email,
          fullname: args.data.fullname,
          password: args.data.password,
          salt: args.data.salt,
          otp_secret: args.data.otp_secret,
          otp_expiry: args.data.otp_expiry,
          verified: args.data.verified ?? false,
          profile_created: args.data.profile_created ?? false,
          resetToken: args.data.resetToken,
          resetTokenExpiry: args.data.resetTokenExpiry,
        };
        const user = new RecruitmentUser(userData);
        const savedUser = await user.save();
        return savedUser;
      } catch (error: any) {
        console.error("MongooseAdapter create error:", error);
        console.error("Error details:", {
          message: error?.message,
          name: error?.name,
          errors: error?.errors,
        });
        throw error;
      }
    },
    update: async (args: { where: { email: string }; data: any }) => {
      return await RecruitmentUser.findOneAndUpdate(
        { email: args.where.email },
        args.data,
        { new: true }
      );
    },
    updateById: async (args: { where: { id: number }; data: any }) => {
      return await RecruitmentUser.findOneAndUpdate(
        { id: args.where.id },
        args.data,
        {
          new: true,
        }
      );
    },
    findById: async (args: { where: { id: number } }) => {
      return await RecruitmentUser.findOne({ id: args.where.id });
    },
  };

  applicant_profile = {
    findUnique: async (args: { where: { email: string } }) => {
      return await ApplicantProfile.findOne({ email: args.where.email });
    },
    create: async (args: { data: any }) => {
      // Use email as _id
      const profileData = {
        _id: args.data.email,
        email: args.data.email,
        first_name: args.data.first_name,
        middle_name: args.data.middle_name,
        last_name: args.data.last_name,
        gender: args.data.gender,
        applicant_address: args.data.applicant_address,
        national_id_number: args.data.national_id_number,
        mobile_no: args.data.mobile_no,
        birth_date: args.data.birth_date,
        birth_district: args.data.birth_district,
        district_of_origin: args.data.district_of_origin,
        nationality: args.data.nationality,
        passport_number: args.data.passport_number,
        marital_status: args.data.marital_status,
        relative_in_organisation: args.data.relative_in_organisation,
        last_modified: args.data.last_modified || new Date(),
      };
      const profile = new ApplicantProfile(profileData);
      return await profile.save();
    },
    update: async (args: { where: { email: string }; data: any }) => {
      const updateData = { ...args.data };
      if (updateData.last_modified === undefined) {
        updateData.last_modified = new Date();
      }
      return await ApplicantProfile.findByIdAndUpdate(
        args.where.email,
        updateData,
        { new: true }
      );
    },
  };

  bc_configs = {
    findUnique: async (args: { where: { id: string } }) => {
      return await BcConfig.findById(args.where.id);
    },
    findFirst: async (args?: { where?: any }) => {
      if (args?.where) {
        return await BcConfig.findOne(args.where);
      }
      return await BcConfig.findOne();
    },
  };

  app_setup = {
    findFirst: async () => {
      return await AppSetup.findOne();
    },
    create: async (args: { data: any }) => {
      const setupData = {
        base_url: args.data.base_url,
        default_company: args.data.default_company,
        ehub_username: args.data.ehub_username,
        ehub_pass: args.data.ehub_pass,
        last_modified: args.data.last_modified || new Date(),
        modified_by: args.data.modified_by,
      };
      const setup = new AppSetup(setupData);
      return await setup.save();
    },
    update: async (args: { where: { setup_id: number }; data: any }) => {
      const updateData = { ...args.data };
      if (updateData.last_modified === undefined) {
        updateData.last_modified = new Date();
      }
      return await AppSetup.findOneAndUpdate(
        { setup_id: args.where.setup_id },
        updateData,
        { new: true }
      );
    },
  };

  async checkConnection(): Promise<boolean> {
    try {
      const state = mongoose.connection.readyState;
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      return state === 1;
    } catch (error) {
      console.error("Mongoose connection check failed:", error);
      return false;
    }
  }

  async queryRaw(query: string): Promise<any> {
    // For MongoDB, we can use mongoose.connection.db
    if (mongoose.connection.readyState === 1) {
      return await mongoose.connection.db?.admin().ping();
    }
    throw new Error("MongoDB not connected");
  }
}
