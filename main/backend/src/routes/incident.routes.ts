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
  assignIncident
);

router.patch(
  "/:id/status",
  authMiddleware,
  updateIncidentStatus
);

router.post(
  "/:id/notes",
  authMiddleware,
  addIncidentNote
);

export default router;
