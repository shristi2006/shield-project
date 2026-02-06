// src/utils/geoResolver.ts
import geoip from "geoip-lite";

export const resolveGeo = (ip: string) => {
  if (!ip || ip === "UNKNOWN") return null;

  // Skip private IPs
  if (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("127.")
  ) {
    return null;
  }

  const geo = geoip.lookup(ip);

  if (!geo) return null;

  return {
    country: geo.country,
    city: geo.city || "Unknown",
    lat: geo.ll?.[0],
    lng: geo.ll?.[1]
  };
};
