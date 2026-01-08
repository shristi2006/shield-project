import type { Log } from "./log.types";
import type { Incident } from "./incident.types";

export interface ServerToClientEvents {
  "log:new": (log: Log) => void;
  "incident:new": (incident: Incident) => void;
  "incident:update": (incident: Incident) => void;
  "attack:blocked": (data: { ip: string }) => void;
}

export interface ClientToServerEvents {
  authenticate: (token: string) => void;
}
