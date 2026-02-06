import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "critical" | "warning" | "success";
  className?: string;
}

const variantStyles = {
  default: {
    icon: "text-primary",
    glow: "bg-primary",
  },
  critical: {
    icon: "text-destructive",
    glow: "bg-destructive",
  },
  warning: {
    icon: "text-warning",
    glow: "bg-warning",
  },
  success: {
    icon: "text-success",
    glow: "bg-success",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "stat-card group hover:border-primary/30 transition-colors",
        className
      )}
    >
      <div className={cn("stat-card-glow", styles.glow)} />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold font-mono">{value.toLocaleString()}</p>
          {trend && (
            <p
              className={cn(
                "text-xs mt-2 font-mono",
                trend.isPositive ? "text-destructive" : "text-success"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last hour
            </p>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors",
            styles.icon
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
