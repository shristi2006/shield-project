import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  ip: string;
  method: string;
  endpoint: string;
  payload: string;
  attackType: "SQLI" | "XSS" | "BRUTE_FORCE" | "RCE" | "UNKNOWN";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userAgent?: string;
  geo?: {
    country: string;
    city: string;
  };
}

const LogSchema = new Schema<ILog>(
  {
    ip: {
      type: String,
      required: true
    },
    method: {
      type: String
    },
    endpoint: {
      type: String
    },
    payload: {
      type: String
    },
    attackType: {
      type: String,
      enum: ["SQLI", "XSS", "BRUTE_FORCE", "RCE", "UNKNOWN"],
      default: "UNKNOWN"
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW"
    },
    userAgent: String,
    geo: {
      country: String,
      city: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<ILog>("Log", LogSchema);
