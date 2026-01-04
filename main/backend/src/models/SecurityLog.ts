import mongoose, { Schema, Document } from "mongoose";

export type AttackType =
  | "SQL_INJECTION"
  | "XSS"
  | "RCE"
  | "BRUTE_FORCE";

export type SeverityLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface ISecurityLog extends Document {
  attackType: AttackType;
  severity: SeverityLevel;
  ip: string;
  endpoint: string;
  method: string;
  payload: {
    body: any;
    query: any;
    headers: any;
  };
  createdAt: Date;
}

const SecurityLogSchema = new Schema<ISecurityLog>(
  {
    attackType: {
      type: String,
      enum: ["SQL_INJECTION", "XSS", "RCE", "BRUTE_FORCE"],
      required: true,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    payload: {
      body: Schema.Types.Mixed,
      query: Schema.Types.Mixed,
      headers: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const SecurityLog = mongoose.model<ISecurityLog>(
  "SecurityLog",
  SecurityLogSchema
);

export default SecurityLog;
