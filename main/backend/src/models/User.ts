import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'ADMIN' | 'ANALYST';
export type AuthProvider = 'GOOGLE';

export interface IUser extends Document {
  email: string;
  name?: string;
  role: UserRole;
  authProvider: AuthProvider;
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true, // Global uniqueness enforced
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'ANALYST'],
      required: true,
    },
    authProvider: {
      type: String,
      enum: ['GOOGLE'],
      default: 'GOOGLE',
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
    timestamps: false, 
    versionKey: false,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
