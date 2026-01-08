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
  requireRole,
  getBlockedIPs
);

router.post(
  "/",
  authMiddleware,
  requireRole,
  blockIP
);

export default router;
