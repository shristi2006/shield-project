// src/routes/blockedIP.routes.ts
import { Router } from "express";
import {
  getBlockedIPs,
  blockIP
} from "../controllers/blockIP.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getBlockedIPs
);

router.post(
  "/",
  authMiddleware,
  blockIP
);

export default router;
