import api from "./api";
import type {
  OverviewMetrics,
  TimelineData,
  SeverityDistribution,
  TopAttackerIP,
  GeoDistribution,
} from "@/types/api";

export const getOverview = async (): Promise<OverviewMetrics> => {
  const res = await api.get("/dashboard/overview");
  return res.data;
};

export const getAttackTimeline = async (
  windowMinutes = 60
): Promise<TimelineData[]> => {
  const res = await api.get("/dashboard/timeline", {
    params: { window: windowMinutes },
  });
  return res.data;
};

export const getSeverityStats = async (): Promise<SeverityDistribution[]> => {
  const res = await api.get("/dashboard/severity");
  return res.data;
};

export const getTopIPs = async (limit = 5): Promise<TopAttackerIP[]> => {
  const res = await api.get("/dashboard/top-ips", { params: { limit } });
  return res.data;
};

export const getGeoDistribution = async (): Promise<GeoDistribution[]> => {
  const res = await api.get("/dashboard/geo");
  return res.data;
};
