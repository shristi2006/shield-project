import mongoose, { Schema, Document } from "mongoose";

export interface IIncident extends Document {
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  logs: mongoose.Types.ObjectId[];
  assignedTo?: mongoose.Types.ObjectId;
  notes?: string;
}

const IncidentSchema = new Schema<IIncident>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true
    },
    status: {
      type: String,
      enum: ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN"
    },
    logs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Log"
      }
    ],
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<IIncident>("Incident", IncidentSchema);
