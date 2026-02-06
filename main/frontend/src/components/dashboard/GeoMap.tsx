import React, { useEffect, useState, useRef } from "react";
import { getGeoDistribution } from "@/services/dashboard.service";
import type { GeoDistribution } from "@/types/api";

interface GeoMapProps {
  className?: string;
}

// Simple world map coordinates for SVG
const worldMapPath = `M 0 60 Q 50 40 100 60 Q 150 80 200 60 Q 250 40 300 60 Q 350 80 400 60 L 400 200 L 0 200 Z`;

export const GeoMap: React.FC<GeoMapProps> = ({ className }) => {
  const [data, setData] = useState<GeoDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const geoData = await getGeoDistribution();
        setData(geoData);
      } catch (error) {
        console.error("Failed to fetch geo data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Convert lat/lng to x/y coordinates (simplified projection)
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-card/50 rounded-lg border border-border overflow-hidden ${className}`}
    >
      {/* Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {/* Map container */}
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Simplified world map outline */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(222, 47%, 12%)" />
            <stop offset="100%" stopColor="hsl(222, 47%, 8%)" />
          </linearGradient>
        </defs>

        {/* Continents (simplified shapes) */}
        {/* North America */}
        <path
          d="M 5 15 Q 15 10 25 15 Q 30 20 25 25 Q 20 30 15 28 Q 10 25 5 20 Z"
          fill="hsl(222, 47%, 14%)"
          stroke="hsl(222, 47%, 20%)"
          strokeWidth="0.3"
        />
        {/* South America */}
        <path
          d="M 20 32 Q 25 30 28 35 Q 30 42 25 48 Q 20 52 18 45 Q 16 38 20 32 Z"
          fill="hsl(222, 47%, 14%)"
          stroke="hsl(222, 47%, 20%)"
          strokeWidth="0.3"
        />
        {/* Europe */}
        <path
          d="M 45 12 Q 52 10 55 15 Q 58 18 55 22 Q 50 25 45 22 Q 42 18 45 12 Z"
          fill="hsl(222, 47%, 14%)"
          stroke="hsl(222, 47%, 20%)"
          strokeWidth="0.3"
        />
        {/* Africa */}
        <path
          d="M 48 25 Q 55 22 60 28 Q 62 35 58 42 Q 52 48 48 42 Q 44 35 48 25 Z"
          fill="hsl(222, 47%, 14%)"
          stroke="hsl(222, 47%, 20%)"
          strokeWidth="0.3"
        />
        {/* Asia */}
        <path
          d="M 58 10 Q 75 8 85 15 Q 90 22 85 28 Q 75 32 65 28 Q 55 22 58 10 Z"
          fill="hsl(222, 47%, 14%)"
          stroke="hsl(222, 47%, 20%)"
          strokeWidth="0.3"
        />
        {/* Australia */}
        <path
          d="M 78 38 Q 85 36 90 40 Q 92 45 88 48 Q 82 50 78 46 Q 75 42 78 38 Z"
          fill="hsl(222, 47%, 14%)"
          stroke="hsl(222, 47%, 20%)"
          strokeWidth="0.3"
        />

        {/* Attack points */}
        {data.map((point, index) => {
          if (!point.lat || !point.lng) return null;
          const { x, y } = latLngToXY(point.lat, point.lng);
          const size = Math.min(Math.max(point.count / 10, 1), 4);

          return (
            <g key={index}>
              {/* Pulse effect */}
              <circle
                cx={x}
                cy={y}
                r={size * 2}
                fill="hsl(0, 72%, 51%)"
                opacity="0.2"
                className="animate-ping"
                style={{ animationDuration: "2s" }}
              />
              {/* Main dot */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="hsl(0, 72%, 51%)"
                stroke="hsl(0, 72%, 70%)"
                strokeWidth="0.3"
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-muted-foreground">Active Attacks</span>
        </div>
        <div className="text-muted-foreground">
          {data.length} regions affected
        </div>
      </div>

      {/* Country list overlay */}
      {data.length > 0 && (
        <div className="absolute top-2 right-2 bg-card/90 border border-border rounded p-2 max-w-[150px]">
          <p className="text-xs font-mono text-muted-foreground mb-1">TOP SOURCES</p>
          <div className="space-y-1">
            {data.slice(0, 5).map((point, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-foreground">{point._id}</span>
                <span className="text-destructive font-mono">{point.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
