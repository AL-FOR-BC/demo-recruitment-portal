import mongoose, { Schema, Document } from "mongoose";

export interface IBcConfig extends Document {
  tenant: string;
  clientId: string;
  clientSecret: string;
  url: string;
  email?: string;
  password?: string;
  companyId?: string;
}

const BcConfigSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    tenant: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    companyId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "bc_configs",
  }
);

export const BcConfig = mongoose.model<IBcConfig>("BcConfig", BcConfigSchema);
