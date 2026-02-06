import api from "./api";
import type { BlockedIP } from "@/types/api";

export const getBlockedIPs = async (): Promise<BlockedIP[]> => {
  const res = await api.get("/blocked-ips");
  return res.data;
};

export const blockIP = async (
  ip: string,
  reason: string
): Promise<BlockedIP> => {
  const res = await api.post("/blocked-ips", { ip, reason });
  return res.data;
};
