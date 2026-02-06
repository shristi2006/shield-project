// src/models/Incident.ts
import mongoose, { Schema } from "mongoose";

export interface IIncident extends mongoose.Document {
  title: string;
  ip: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  updatedAt: Date;
  createdAt: Date;
  logs: mongoose.Types.ObjectId[];
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
}


const IncidentSchema = new Schema<IIncident>(
  {
    title: { type: String, required: true },

    ip: { type: String, required: true, index: true },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },

    logs: [{ type: Schema.Types.ObjectId, ref: "SecurityLog" }],

    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

IncidentSchema.index({ ip: 1, status: 1 });

export const Incident = mongoose.model<IIncident>(
  "Incident",
  IncidentSchema
);
