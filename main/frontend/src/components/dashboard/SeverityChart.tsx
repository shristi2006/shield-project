import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getSeverityStats } from "@/services/dashboard.service";
import type { SeverityDistribution, SeverityLevel } from "@/types/api";

interface SeverityChartProps {
  className?: string;
}

const severityColors: Record<SeverityLevel, string> = {
  CRITICAL: "hsl(0, 72%, 51%)",
  HIGH: "hsl(25, 95%, 53%)",
  MEDIUM: "hsl(38, 92%, 50%)",
  LOW: "hsl(142, 76%, 36%)",
};

export const SeverityChart: React.FC<SeverityChartProps> = ({ className }) => {
  const [data, setData] = useState<SeverityDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getSeverityStats();
        setData(stats);
      } catch (error) {
        console.error("Failed to fetch severity stats:", error);
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

  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
    color: severityColors[item._id] || "hsl(222, 47%, 50%)",
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            stroke="hsl(222, 47%, 8%)"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 47%, 8%)",
              border: "1px solid hsl(222, 47%, 18%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
            }}
            formatter={(value: number) => [value, "Count"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs font-mono text-muted-foreground">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
