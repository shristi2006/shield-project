export type AttackType = "SQLi" | "XSS" | "RCE" | "BRUTE_FORCE";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Log {
  _id: string;
  ip: string;
  attackType: AttackType;
  payload: string;
  severity: Severity;
  geo?: string;
  createdAt: string;
}
