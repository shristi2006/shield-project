const geoCache = new Map<string, any>();

export const getCachedGeo = (ip: string, resolver: Function) => {
  if (geoCache.has(ip)) return geoCache.get(ip);

  const geo = resolver(ip);
  geoCache.set(ip, geo);
  return geo;
};
