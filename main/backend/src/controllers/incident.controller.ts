import { Request, Response } from "express";
import {Incident} from "../models/Incident";
import { getIO } from "../sockets/index";
import { Types } from "mongoose";
export const getIncidents = async (_req: Request, res: Response) => {
  try {
    const incidents = await Incident.find()
      .populate("assignedTo", "email role")
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch {
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
};

export const assignIncident = async (req: Request, res: Response) => {
  try {
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

    const io = getIO();
    io.emit("incident:update", incident);

    res.status(200).json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assignment failed" });
  }
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    const io = getIO();
    io.emit("incident:update", incident);

    res.json(incident);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

export const addIncidentNote = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Not found" });

    if (!incident.notes) {
      incident.notes = "";
    }

    incident.notes += `\n${req.user.id}: ${req.body.text}`;
      createdAt: new Date();

    await incident.save();

    const io = getIO();
    io.emit("incident:update", incident);

    res.json(incident);
  } catch {
    res.status(500).json({ message: "Note failed" });
  }
};

