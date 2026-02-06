// src/models/BlockedIP.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBlockedIP extends Document {
  ip: string;
  reason: string;
  blockedAt: Date;
  expiresAt?: Date;
}

const BlockedIPSchema = new Schema<IBlockedIP>({
  ip: { type: String, required: true, unique: true },
  reason: { type: String, required: true },
  blockedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

export default mongoose.model<IBlockedIP>(
  "BlockedIP",
  BlockedIPSchema
);
