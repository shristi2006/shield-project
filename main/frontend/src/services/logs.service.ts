import api from "./api";
import type { SecurityLog, LogStats } from "@/types/api";

export const getLogs = async (): Promise<SecurityLog[]> => {
  const res = await api.get("/logs");
  return res.data;
};

export const getLogStats = async (): Promise<LogStats> => {
  const res = await api.get("/logs/stats");
  return res.data;
};
