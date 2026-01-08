import { Request, Response, NextFunction } from "express";
import BlockedIP from "../models/BlockedIP";

export const ipBlocker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip;

  const blocked = await BlockedIP.findOne({ ip });
  if (blocked) {
    return res.status(403).json({
      message: "Your IP is blocked",
      reason: blocked.reason,
    });
  }

  next();
};
