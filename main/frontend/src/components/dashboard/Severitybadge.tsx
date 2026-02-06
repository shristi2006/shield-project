import React from "react";
import { cn } from "@/lib/utils";
import type { SeverityLevel } from "@/types/api";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; className: string }
> = {
  CRITICAL: {
    label: "CRITICAL",
    className: "severity-critical",
  },
  HIGH: {
    label: "HIGH",
    className: "severity-high",
  },
  MEDIUM: {
    label: "MEDIUM",
    className: "severity-medium",
  },
  LOW: {
    label: "LOW",
    className: "severity-low",
  },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className,
}) => {
  const config = severityConfig[severity] || severityConfig.LOW;

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
