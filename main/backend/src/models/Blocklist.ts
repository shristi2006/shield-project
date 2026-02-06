// src/models/Blocklist.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBlocklist extends Document {
  ip: string;
  reason: string;
  blockedBy: mongoose.Types.ObjectId;
  expiresAt?: Date;
}

const BlocklistSchema = new Schema<IBlocklist>(
  {
    ip: {
      type: String,
      required: true,
      unique: true
    },
    reason: {
      type: String
    },
    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    expiresAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model<IBlocklist>("Blocklist", BlocklistSchema);
