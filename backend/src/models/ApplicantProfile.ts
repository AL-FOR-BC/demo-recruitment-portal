import mongoose, { Schema, Document } from "mongoose";

export interface IApplicantProfile extends Document {
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: string;
  applicant_address?: string;
  national_id_number: string;
  mobile_no: string;
  birth_date: Date;
  birth_district?: string;
  district_of_origin?: string;
  nationality: string;
  passport_number?: string;
  marital_status: string;
  relative_in_organisation: boolean;
  last_modified: Date;
}

const ApplicantProfileSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      maxlength: 60,
    },
    middle_name: {
      type: String,
      required: false,
      maxlength: 60,
    },
    last_name: {
      type: String,
      required: true,
      maxlength: 60,
    },
    gender: {
      type: String,
      required: true,
      maxlength: 60,
    },
    applicant_address: {
      type: String,
      required: false,
      maxlength: 255,
    },
    national_id_number: {
      type: String,
      required: true,
      maxlength: 50,
    },
    mobile_no: {
      type: String,
      required: true,
      maxlength: 60,
    },
    birth_date: {
      type: Date,
      required: true,
    },
    birth_district: {
      type: String,
      required: false,
      maxlength: 50,
    },
    district_of_origin: {
      type: String,
      required: false,
      maxlength: 50,
    },
    nationality: {
      type: String,
      required: true,
      maxlength: 50,
    },
    passport_number: {
      type: String,
      required: false,
      maxlength: 60,
    },
    marital_status: {
      type: String,
      required: true,
      maxlength: 60,
    },
    relative_in_organisation: {
      type: Boolean,
      required: true,
    },
    last_modified: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "applicant_profile",
    _id: true,
  }
);

// Set _id to email before saving
ApplicantProfileSchema.pre("save", function (
  this: IApplicantProfile,
  next: (err?: Error) => void
) {
  if (!this._id && this.email) {
    (this as any)._id = this.email;
  }
  next();
} as any);

export const ApplicantProfile = mongoose.model<IApplicantProfile>(
  "ApplicantProfile",
  ApplicantProfileSchema
);
