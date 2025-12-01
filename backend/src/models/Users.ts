import mongoose, { Schema, Document } from "mongoose";

export interface IRecruitmentUser extends Document {
  id: number;
  fullname: string;
  email: string;
  password: string;
  otp_secret: string;
  otp_expiry?: Date;
  verified: boolean;
  profile_created: boolean;
  salt: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const RecruitmentUserSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: false,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 255,
    },
    otp_secret: {
      type: String,
      required: true,
      maxlength: 255,
    },
    otp_expiry: {
      type: Date,
      required: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    profile_created: {
      type: Boolean,
      required: true,
      default: false,
    },
    salt: {
      type: String,
      required: true,
      maxlength: 255,
    },
    resetToken: {
      type: String,
      required: false,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false,
    collection: "recruitment_user",
  }
);

// Auto-increment id if not provided
RecruitmentUserSchema.pre("save", async function (this: IRecruitmentUser) {
  // Only auto-generate id for new documents
  if (this.isNew && (!this.id || this.id === 0)) {
    try {
      // Use the model constructor to query for max id
      const Model = this.constructor as mongoose.Model<IRecruitmentUser>;

      // Get the maximum id from existing documents
      const maxUser = await Model.findOne()
        .sort({ id: -1 })
        .select("id")
        .lean();

      // Set id to max + 1, or 1 if no documents exist
      this.id = maxUser && maxUser.id ? maxUser.id + 1 : 1;
    } catch (error: any) {
      // If there's an error, default to 1
      console.error("Error auto-generating id:", error?.message || error);
      this.id = 1;
    }
  }
});

// Export model after hook is defined
export const RecruitmentUser = mongoose.model<IRecruitmentUser>(
  "RecruitmentUser",
  RecruitmentUserSchema
);
