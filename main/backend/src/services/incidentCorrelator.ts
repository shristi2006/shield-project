import SecurityLog from "../models/SecurityLog";
import BlockedIP from "../models/BlockedIP";
import { getIO } from "../sockets";
import {
  BRUTE_FORCE_THRESHOLD,
  BRUTE_FORCE_WINDOW_MS,
  CRITICAL_THRESHOLD,
} from "../utils/correlationRules";

export const correlateIncident = async (ip: string) => {
  try {
    const now = Date.now();
    const io = getIO();

    // ---------- Brute Force ----------
    const since = new Date(now - BRUTE_FORCE_WINDOW_MS);

    const bruteAttempts = await SecurityLog.countDocuments({
      ip,
      attackType: "BRUTE_FORCE",
      createdAt: { $gte: since },
    });

    if (bruteAttempts >= BRUTE_FORCE_THRESHOLD) {
      await blockIP(ip, "Brute force attack detected");
      io.emit("attack:blocked", { ip, reason: "Brute force attack" });
      return;
    }

    // ---------- Critical Attacks ----------
    const criticalCount = await SecurityLog.countDocuments({
      ip,
      severity: "CRITICAL",
    });

    if (criticalCount >= CRITICAL_THRESHOLD) {
      await blockIP(ip, "Multiple critical attacks detected");
      io.emit("attack:blocked", {
        ip,
        reason: "Multiple critical attacks",
      });
    }
  } catch (err) {
    console.error("Incident correlation error:", err);
  }
};

const blockIP = async (ip: string, reason: string) => {
  const exists = await BlockedIP.findOne({ ip });
  if (exists) return;

  await BlockedIP.create({
    ip,
    reason,
    blockedAt: new Date(),
  });

  console.log(`IP BLOCKED: ${ip} | ${reason}`);
};
