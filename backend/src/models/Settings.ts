import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  allowCompanyChange: boolean;
  companyLogo?: string;
  themeColor: string;
  companyName?: string;
  help?: string;
}

const SettingsSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    allowCompanyChange: {
      type: Boolean,
      default: false,
    },
    companyLogo: {
      type: String,
      required: false,
    },
    themeColor: {
      type: String,
      default: "#094BAC",
    },
    companyName: {
      type: String,
      required: false,
    },
    help: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "settings",
  }
);

export const Settings = mongoose.model<ISettings>("Settings", SettingsSchema);
