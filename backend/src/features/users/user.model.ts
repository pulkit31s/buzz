import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Anonymous identity options for Buzz users.
 */
export const ANONYMOUS_NAMES = [
  "Anonymous Fox",
  "Anonymous Owl",
  "Anonymous Panda",
  "Anonymous Tiger",
] as const;

export type AnonymousNameType = (typeof ANONYMOUS_NAMES)[number];

/**
 * TypeScript interface representing a User document in MongoDB.
 */
export interface IUser {
  collegeId: string;
  email: string;
  password?: string;
  username: string;
  anonymousName: string;
  anonymousAvatar: string;
  year: string;
  branch: string;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    collegeId: {
      type: String,
      required: [true, "College ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // CRITICAL: Never return password by default
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    anonymousName: {
      type: String,
      required: true,
      enum: ANONYMOUS_NAMES,
    },
    anonymousAvatar: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, "Branch/Department is required"],
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc: any, ret: any) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc: any, ret: any) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Pre-save hook: Hash password before saving to MongoDB using bcrypt.
 */
userSchema.pre("save", async function (this: any, next: any) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Instance method: Compare candidate plaintext password against stored bcrypt hash.
 */
userSchema.methods.comparePassword = async function (
  this: any,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);
