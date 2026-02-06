// src/middleware/securityScanner.ts
import { Request, Response, NextFunction } from "express";
import {SecurityLog, AttackType } from "../models/SecurityLog";
import { classifyThreat } from "../utils/threatClassifier";

/* ---------------- ATTACK PATTERNS ---------------- */

const sqlPatterns = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /(\bOR\b|\bAND\b).*(=|<|>)/i,
];

const xssPatterns = [
  /<script.*?>.*?<\/script>/i,
  /javascript:/i,
  /onerror\s*=/i,
];

const rcePatterns = [
  /\b(cat|ls|pwd|whoami|id|uname)\b/i,
  /(\/bin\/bash|\/bin\/sh)/i,
  /\b(cmd\.exe|powershell)\b/i,
  /\b(wget|curl)\b/i,
  /(\|\||&&)\s*(cat|ls|pwd|whoami|id)/i
];

/* ---------------- HELPERS ---------------- */

const sanitizeHeaders = (headers: any) => {
  const safeHeaders = { ...headers };
  delete safeHeaders.authorization;
  delete safeHeaders.cookie;
  return safeHeaders;
};

const detectAttack = (input: any): AttackType | null => {
  if (!input) return null;

  const data = JSON.stringify(input);

  if (sqlPatterns.some((p) => p.test(data))) return "SQL_INJECTION";
  if (xssPatterns.some((p) => p.test(data))) return "XSS";
  if (rcePatterns.some((p) => p.test(data))) return "RCE";

  return null;
};

const getClientIp = (req: Request): string => {
  return (
    req.ip ||
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    "UNKNOWN"
  );
};

/* ---------------- MIDDLEWARE ---------------- */

export const securityScanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const attackType =
      detectAttack(req.body) ||
      detectAttack(req.query) ||
      detectAttack({
        "user-agent": req.headers["user-agent"],
        "referer": req.headers["referer"],
      })
;

    if (attackType) {
      const severity = classifyThreat(attackType);
      const ipAddress = getClientIp(req);

      await SecurityLog.create({
        attackType,
        severity,
        ip: ipAddress,
        endpoint: req.originalUrl,
        method: req.method,
        payload: {
          body: req.body,
          query: req.query,
          headers: sanitizeHeaders(req.headers),
        },
      });

      console.log("ATTACK BLOCKED", {
        attackType,
        severity,
        ip: ipAddress,
        path: req.originalUrl,
        method: req.method,
      });

      return res.status(403).json({
        message: "Malicious request detected",
        attackType,
        severity,
      });
    }

    next();
  } catch (error) {
    console.error("Security Scanner Error:", error);
    next(error); // never block traffic due to scanner failure
  }
};
