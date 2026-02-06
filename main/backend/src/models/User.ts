// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "ADMIN" | "ANALYST";
export type AuthProvider = "GOOGLE" | "LOCAL";

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  role: UserRole;
  authProvider: AuthProvider;
  avatar?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      select: false,
      required: function (this: IUser) {
        return this.authProvider === "LOCAL";
      },
    },

    name: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["ADMIN", "ANALYST"],
      required: true,
    },

    authProvider: {
      type: String,
      enum: ["GOOGLE", "LOCAL"],
      required: true,
    },

    avatar: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

/* Hash password */
UserSchema.pre("save", async function () {
  if (this.authProvider !== "LOCAL") return;
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};


export default mongoose.model<IUser>("User", UserSchema);
