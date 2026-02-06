import React from "react";
import { LiveLogsTable } from "@/components/dashboard/LiveLogsTable";

const AnalystLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Live Security Logs</h1>
        <p className="text-muted-foreground text-sm font-mono">
          Real-time stream of security events and detected threats
        </p>
      </div>

      <LiveLogsTable limit={100} />
    </div>
  );
};

export default AnalystLogs;
