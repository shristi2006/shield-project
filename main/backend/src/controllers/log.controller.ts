// src/controllers/log.controller.ts
import { Request, Response } from "express";
import {SecurityLog} from "../models/SecurityLog";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const logs = await SecurityLog.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};
export const getLogStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalLogs,
      byAttackType,
      bySeverity,
      topIPs
    ] = await Promise.all([
      SecurityLog.countDocuments(),

      SecurityLog.aggregate([
        { $group: { _id: "$attackType", count: { $sum: 1 } } }
      ]),

      SecurityLog.aggregate([
        { $group: { _id: "$severity", count: { $sum: 1 } } }
      ]),

      SecurityLog.aggregate([
        { $group: { _id: "$ip", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      totalLogs,
      byAttackType,
      bySeverity,
      topIPs
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch log stats" });
  }
};
