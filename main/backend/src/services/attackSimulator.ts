import SecurityLog, {
  AttackType,
  SeverityLevel,
} from "../models/SecurityLog";
import { classifyThreat } from "../utils/threatClassifier";

/* ------------------ helpers ------------------ */

const randomIP = () =>
  `${rand()}.${rand()}.${rand()}.${rand()}`;

const rand = () => Math.floor(Math.random() * 255);

const attackPayloads: Record<AttackType, any> = {
  SQL_INJECTION: {
    body: { username: "admin' OR '1'='1" },
    query: {},
    headers: {},
  },

  XSS: {
    body: { comment: "<script>alert(1)</script>" },
    query: {},
    headers: {},
  },

  RCE: {
    body: { cmd: "rm -rf /" },
    query: {},
    headers: {},
  },

  BRUTE_FORCE: {
    body: { password: "123456" },
    query: {},
    headers: {},
  },
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

  return {
    attackType,
    severity,
    ip: randomIP(),
    endpoint: "/api/login",
    method: "POST",
    payload: attackPayloads[attackType],
  };
}

/* ------------------ simulator ------------------ */

export const startAttackSimulator = (intervalMs = 5000) => {
  console.log("🔥 Attack Simulator started");

  setInterval(async () => {
    try {
      const attack = generateAttack();

      await SecurityLog.create({
        attackType: attack.attackType,
        severity: attack.severity,
        ip: attack.ip,
        endpoint: attack.endpoint,
        method: attack.method,
        payload: attack.payload,
      });

      console.log(
        `🚨 [SIMULATED] ${attack.attackType} | ${attack.severity} | ${attack.ip}`
      );
    } catch (err) {
      console.error("Simulator error:", err);
    }
  }, intervalMs);
};
