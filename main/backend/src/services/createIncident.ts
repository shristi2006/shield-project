import { Incident }from "../models/Incident";
import {SecurityLog, SeverityLevel } from "../models/SecurityLog";

export const createIncident = async (
  ip: string,
  title: string,
  severity: SeverityLevel
) => {
  // Prevent duplicate active incidents per IP
  const existing = await Incident.findOne({
    ip,
    status: { $ne: "RESOLVED" },
  });

  if (existing) return existing;

  // Attach recent logs for investigation
  const logs = await SecurityLog.find({ ip })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("_id");

  const incident = await Incident.create({
    title,
    ip,
    severity,
    status: "OPEN",
    logs: logs.map((l) => l._id),
  });

  return incident;
};
