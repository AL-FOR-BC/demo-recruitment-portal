import mongoose, { Schema, Document } from "mongoose";

export interface IAppSetup extends Document {
  setup_id: number;
  base_url: string;
  default_company: string;
  ehub_username: string;
  ehub_pass: string;
  last_modified: Date;
  modified_by: string;
}

const AppSetupSchema: Schema = new Schema(
  {
    setup_id: {
      type: Number,
      required: true,
      unique: true,
    },
    base_url: {
      type: String,
      required: true,
      maxlength: 50,
    },
    default_company: {
      type: String,
      required: true,
      maxlength: 50,
    },
    ehub_username: {
      type: String,
      required: true,
      maxlength: 20,
    },
    ehub_pass: {
      type: String,
      required: true,
      maxlength: 255,
    },
    last_modified: {
      type: Date,
      required: true,
    },
    modified_by: {
      type: String,
      required: true,
      maxlength: 50,
    },
  },
  {
    timestamps: false,
    collection: "app_setup",
  }
);

// Auto-increment setup_id if not provided
AppSetupSchema.pre("save", async function (
  this: IAppSetup,
  next: (err?: Error) => void
) {
  if (!this.setup_id) {
    const count = await mongoose.model<IAppSetup>("AppSetup").countDocuments();
    this.setup_id = count + 1;
  }
  next();
} as any);

export const AppSetup = mongoose.model<IAppSetup>("AppSetup", AppSetupSchema);
