import { Router } from "express";
import {
  getIncidents,
  assignIncident,
  updateIncidentStatus,
  addIncidentNote
} from "../controllers/incident.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/", authMiddleware, getIncidents);

router.post(
  "/:id/assign",
  authMiddleware,
  requireRole,
  assignIncident
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole,
  updateIncidentStatus
);

router.post(
  "/:id/notes",
  authMiddleware,
  requireRole,
  addIncidentNote
);

export default router;
