import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getOverviewMetrics,
  getAttackTimeline,
  getSeverityDistribution,
  getTopAttackerIPs,
  getGeoDistribution
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/overview", authMiddleware, getOverviewMetrics);
router.get("/timeline", authMiddleware, getAttackTimeline);
router.get("/severity", authMiddleware, getSeverityDistribution);
router.get("/top-ips", authMiddleware, getTopAttackerIPs);
router.get("/geo", authMiddleware, getGeoDistribution);

export default router;
