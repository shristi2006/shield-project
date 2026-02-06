// src/controllers/incident.controller.ts
import { Request, Response } from "express";
import {Incident} from "../models/Incident";
import { getIO } from "../sockets/index";
import { Types } from "mongoose";
export const getIncidents = async (_req: Request, res: Response) => {
  try {
    const incidents = await Incident.find()
      .populate("assignedTo", "email", "role")
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch {
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
};

export const assignIncident = async (req: Request, res: Response) => {
  try {
    console.log("ASSIGN INCIDENT HIT");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    incident.assignedTo = new Types.ObjectId(req.user.id);
    incident.status = "ASSIGNED";

    await incident.save();

    // 🔌 socket emit (non-blocking)
    try {
      const io = getIO();
      io.emit("incident:update", {
        id: incident._id,
        status: incident.status,
        assignedTo: incident.assignedTo,
        severity: incident.severity,
        updatedAt: incident.updatedAt,
      });
    } catch {
      console.warn("Socket not initialized, skipping emit");
    }

    return res.json(incident);
  } catch (err) {
    console.error("Assign incident failed:", err);
    return res.status(500).json({ message: "Assignment failed" });
  }
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowed = ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }
    try {
      const io = getIO();
      io.emit("incident:update", {
        id: incident._id,
        status: incident.status,
        assignedTo: incident.assignedTo,
        severity: incident.severity,
        updatedAt: incident.updatedAt,
      });
    } catch {
      console.warn("Socket not initialized, skipping emit");
    }

    return res.json(incident);
  } catch (err) {
    console.error("Update incident status failed:", err);
    return res.status(500).json({ message: "Update failed" });
  }
};

export const addIncidentNote = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: "Not found" });
    }

    incident.notes = incident.notes || "";
    incident.notes += `\n${req.user.id}: ${req.body.text}`;

    await incident.save();

    try {
      const io = getIO();
      io.emit("incident:update", {
        id: incident._id,
        status: incident.status,
        assignedTo: incident.assignedTo,
        severity: incident.severity,
        updatedAt: incident.updatedAt,
      });
    } catch {
      console.warn("Socket not initialized, skipping emit");
    }

    return res.json(incident);
  } catch (err) {
    console.error("Note failed:", err);
    return res.status(500).json({ message: "Note failed" });
  }
};
