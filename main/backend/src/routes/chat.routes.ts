import { Router } from "express";
import { askAI } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/ask", authMiddleware, askAI);

export default router;