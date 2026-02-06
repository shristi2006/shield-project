// src/utils/threatClassifier.ts
import { AttackType, SeverityLevel } from "../models/SecurityLog";

export const classifyThreat = (
  attackType: AttackType
): SeverityLevel => {
  switch (attackType) {
    case "SQL_INJECTION":
      return "HIGH";

    case "RCE":
      return "CRITICAL";

    case "XSS":
      return "MEDIUM";

    case "BRUTE_FORCE":
      return "CRITICAL";

    default:
      return "LOW";
  }
};
