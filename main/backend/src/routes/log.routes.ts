import { Router } from "express";
import { getLogs, getLogStats } from "../controllers/log.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getLogs);
router.get("/stats", authMiddleware, getLogStats);

export default router;
