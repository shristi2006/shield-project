// src/controllers/blockIP.controller.ts

import { getIO } from "../sockets";
import BlockedIP from "../models/BlockedIP";
import { Request, Response } from "express";

export const getBlockedIPs = async (_req: Request, res: Response) => {
  try {
    const blockedIPs = await BlockedIP.find().sort({ blockedAt: -1 });
    res.json(blockedIPs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blocked IPs" });
  }
};

export const blockIP = async (req: Request, res: Response) => {
  const { ip, reason } = req.body;

  const exists = await BlockedIP.findOne({ ip });
  if (exists) return res.status(400).json({ message: "Already blocked" });

  const blocked = await BlockedIP.create({
    ip,
    reason,
    blockedAt: new Date()
  });

  const io = getIO();
  io.emit("attack:blocked", {
    ip,
    reason,
    time: new Date()
  });

  res.json(blocked);
};
