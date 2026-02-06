import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { getAttackTimeline } from "@/services/dashboard.service";
import type { TimelineData } from "@/types/api";

interface AttackTimelineChartProps {
  className?: string;
}

export const AttackTimelineChart: React.FC<AttackTimelineChartProps> = ({
  className,
}) => {
  const [data, setData] = useState<TimelineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeline = await getAttackTimeline(60);
        setData(timeline);
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = data.map((item) => ({
    time: item._id.split(" ")[1] || item._id,
    attacks: item.count,
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(187, 85%, 53%)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(187, 85%, 53%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(222, 47%, 18%)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(215, 20%, 55%)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 8%)",
              border: "1px solid hsl(222, 47%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
            }}
            labelStyle={{ color: "hsl(215, 20%, 55%)" }}
          />
          <Area
            type="monotone"
            dataKey="attacks"
            stroke="hsl(187, 85%, 53%)"
            strokeWidth={2}
            fill="url(#attackGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
