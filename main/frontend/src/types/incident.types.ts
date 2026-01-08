import type { Log, Severity } from "./log.types";

export type IncidentStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED";

export interface Incident {
  _id: string;
  logs: Log[];
  status: IncidentStatus;
  priority: Severity;
  assignedTo?: string;
  notes?: string[];
  createdAt: string;
}
