// API Types for MicroSOC Command Center

export type UserRole = "ADMIN" | "ANALYST";
export type AuthProvider = "GOOGLE" | "LOCAL";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  authProvider: AuthProvider;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type AttackType = "SQL_INJECTION" | "XSS" | "RCE" | "BRUTE_FORCE";
export type SeverityLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";

export interface GeoLocation {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

export interface SecurityLog {
  _id: string;
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
  geo?: GeoLocation;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  _id: string;
  title: string;
  ip: string;
  severity: SeverityLevel;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: IncidentStatus;
  logs: string[];
  assignedTo?: {
    _id: string;
    email: string;
    role: UserRole;
  } | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedIP {
  _id: string;
  ip: string;
  reason: string;
  blockedAt: string;
  expiresAt?: string;
}

export interface OverviewMetrics {
  totalLogs: number;
  activeIncidents: number;
  criticalAttacks: number;
}

export interface TimelineData {
  _id: string;
  count: number;
}

export interface SeverityDistribution {
  _id: SeverityLevel;
  count: number;
}

export interface TopAttackerIP {
  _id: string;
  count: number;
  maxSeverity: SeverityLevel;
}

export interface GeoDistribution {
  _id: string;
  count: number;
  lat: number;
  lng: number;
}

export interface LogStats {
  totalLogs: number;
  byAttackType: { _id: AttackType; count: number }[];
  bySeverity: { _id: SeverityLevel; count: number }[];
  topIPs: { _id: string; count: number }[];
}

// Socket events
export interface SocketLogEvent {
  attackType: AttackType;
  severity: SeverityLevel;
  ip: string;
  endpoint: string;
  method: string;
  geo?: GeoLocation;
  payload: any;
}

export interface SocketBlockedEvent {
  ip: string;
  reason: string;
  time: string;
}

export interface SocketIncidentEvent {
  id: string;
  status: IncidentStatus;
  assignedTo?: string;
  severity: SeverityLevel;
  updatedAt: string;
}
