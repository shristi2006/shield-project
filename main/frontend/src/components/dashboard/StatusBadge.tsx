import React from "react";
import { cn } from "@/lib/utils";
import type { IncidentStatus } from "@/types/api";

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

const statusConfig: Record<
  IncidentStatus,
  { label: string; className: string }
> = {
  OPEN: {
    label: "OPEN",
    className: "bg-destructive/20 text-destructive border border-destructive/30",
  },
  ASSIGNED: {
    label: "ASSIGNED",
    className: "bg-warning/20 text-warning border border-warning/30",
  },
  IN_PROGRESS: {
    label: "IN PROGRESS",
    className: "bg-primary/20 text-primary border border-primary/30",
  },
  RESOLVED: {
    label: "RESOLVED",
    className: "bg-success/20 text-success border border-success/30",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-mono font-medium rounded",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
