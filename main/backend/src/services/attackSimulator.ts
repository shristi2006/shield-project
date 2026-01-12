import { SecurityLog, AttackType, SeverityLevel } from "../models/SecurityLog";
import BlockedIP from "../models/BlockedIP";
import { classifyThreat } from "../utils/threatClassifier";
import { correlateIncident } from "./incidentCorrelator";
import { getIO } from "../sockets";
import { resolveGeo } from "../utils/geoResolver";
import { getCachedGeo } from "../utils/geoCache";
/* ------------------ helpers ------------------ */

const ipPool = [
  "8.8.8.8",        // USA
  "1.1.1.1",        // Australia
  "91.198.174.192", // Europe
  "103.21.244.0"    // India
];


const randomIP = () =>
  ipPool[Math.floor(Math.random() * ipPool.length)];

const attackPayloads: Record<AttackType, any> = {
  SQL_INJECTION: { body: { username: "admin' OR '1'='1" }, query: {}, headers: {} },
  XSS: { body: { comment: "<script>alert(1)</script>" }, query: {}, headers: {} },
  RCE: { body: { cmd: "rm -rf /" }, query: {}, headers: {} },
  BRUTE_FORCE: { body: { password: "123456" }, query: {}, headers: {} },
};

const attackTypes: AttackType[] = [
  "SQL_INJECTION",
  "XSS",
  "RCE",
  "BRUTE_FORCE",
];

function generateAttack() {
  const attackType =
    attackTypes[Math.floor(Math.random() * attackTypes.length)];

  const severity: SeverityLevel = classifyThreat(attackType);

  const ip = randomIP();
  const geo = getCachedGeo(ip, resolveGeo)
;

return {
  attackType,
  severity,
  ip,
  endpoint: "/api/auth/login",
  method: "POST",
  geo,
  payload: attackPayloads[attackType],
};

}

/* ------------------ simulator ------------------ */

export const startAttackSimulator = (intervalMs = 5000) => {
  console.log("Attack Simulator started");

  const io = getIO();

  setInterval(async () => {
    try {
      const attack = generateAttack();

      // Save security log
      const logData = { ...attack, geo: attack.geo ?? undefined };
      await SecurityLog.create(logData);

      // Correlation engine
      await correlateIncident(attack.ip);

      // Emit new log
      io.emit("log:new", attack);

      console.log(
        `[SIMULATED] ${attack.attackType} | ${attack.severity} | ${attack.ip}`
      );

      /* ------------------ IP BLOCKING LOGIC ------------------ */

      if (attack.severity === "CRITICAL") {
        const alreadyBlocked = await BlockedIP.findOne({ ip: attack.ip });

        if (!alreadyBlocked) {
          await BlockedIP.create({
            ip: attack.ip,
            reason: `Auto-blocked due to ${attack.attackType}`,
          });

          console.log(
            `[BLOCKED] IP ${attack.ip} blocked due to ${attack.attackType}`
          );

          io.emit("attack:blocked", {
            ip: attack.ip,
            reason: attack.attackType,
            time: new Date(),
          });
        }
      }

    } catch (err) {
      console.error("Simulator error:", err);
    }
  }, intervalMs);
};
