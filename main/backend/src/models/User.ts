import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

/* ================= TYPES ================= */

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
}

/* ================= SCHEMA ================= */

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
      select: false, //  never return password
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

    avatar: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

/* ================= PRE-SAVE PASSWORD HASH ================= */

// ✅ ASYNC HOOK — NO next()
UserSchema.pre("save", async function () {
  // Only hash password for LOCAL auth
  if (this.authProvider !== "LOCAL") return;

  // Skip if password not modified or missing
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* ================= EXPORT ================= */

export default mongoose.model<IUser>("User", UserSchema);
