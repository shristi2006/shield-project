import { Request, Response } from "express";
import { SecurityLog } from "../models/SecurityLog";
import { Incident } from "../models/Incident";

export const getOverviewMetrics = async (
  _req: Request,
  res: Response
) => {
  try {
    const [
      totalLogs,
      activeIncidents,
      criticalAttacks
    ] = await Promise.all([
      SecurityLog.countDocuments(),
      Incident.countDocuments({ status: { $ne: "RESOLVED" } }),
      SecurityLog.countDocuments({ severity: "CRITICAL" })
    ]);

    res.json({
      totalLogs,
      activeIncidents,
      criticalAttacks
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load overview metrics" });
  }
};

export const getAttackTimeline = async (
  req: Request,
  res: Response
) => {
  try {
    const windowMinutes = Number(req.query.window) || 60;
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);

    const timeline = await SecurityLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(timeline);
  } catch {
    res.status(500).json({ message: "Failed to load timeline" });
  }
};

export const getSeverityDistribution = async (
  _req: Request,
  res: Response
) => {
  try {
    const data = await SecurityLog.aggregate([
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to load severity stats" });
  }
};

export const getTopAttackerIPs = async (
  req: Request,
  res: Response
) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const ips = await SecurityLog.aggregate([
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 },
          maxSeverity: { $max: "$severity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);

    res.json(ips);
  } catch {
    res.status(500).json({ message: "Failed to load top IPs" });
  }
};

export const getGeoDistribution = async (req: Request, res: Response) => {
  try {
    const data = await SecurityLog.aggregate([
      {
        $match: {
          geo: { $exists: true },
          "geo.country": { $ne: null }
        }
      },
      {
        $group: {
          _id: "$geo.country",
          count: { $sum: 1 },
          lat: { $first: "$geo.lat" },
          lng: { $first: "$geo.lng" }
        }
      }
    ]);

    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to load geo data" });
  }
};
