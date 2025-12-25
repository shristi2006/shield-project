import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "ANALYST";
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["ADMIN", "ANALYST"],
      default: "ANALYST"
    }
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  // If password isn't modified, just return to move to the next middleware
  if (!this.isModified("password")) return;

  // No need for try/catch here unless you want custom error logic; 
  // Mongoose will catch any errors from bcrypt.hash automatically.
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
