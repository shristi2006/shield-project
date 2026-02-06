import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { getLogs } from "@/services/logs.service";
import { onNewLog, offNewLog } from "@/services/socket.service";
import { SeverityBadge } from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SecurityLog, SocketLogEvent } from "@/types/api";

interface LiveLogsTableProps {
  limit?: number;
  className?: string;
}

export const LiveLogsTable: React.FC<LiveLogsTableProps> = ({
  limit = 50,
  className,
}) => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLogCount, setNewLogCount] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getLogs();
      setLogs(data.slice(0, limit));
      setNewLogCount(0);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();

    const handleNewLog = (log: SocketLogEvent) => {
      setLogs((prev) => {
        const newLog: SecurityLog = {
          _id: Date.now().toString(),
          ...log,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [newLog, ...prev].slice(0, limit);
      });
      setNewLogCount((prev) => prev + 1);
    };

    onNewLog(handleNewLog);

    return () => {
      offNewLog(handleNewLog);
    };
  }, [limit, fetchLogs]);

  const attackTypeColors: Record<string, string> = {
    SQL_INJECTION: "text-chart-5",
    XSS: "text-chart-4",
    RCE: "text-chart-3",
    BRUTE_FORCE: "text-chart-2",
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Live Security Logs</h3>
          {newLogCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-mono bg-primary/20 text-primary rounded animate-pulse">
              +{newLogCount} new
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-mono text-xs">TIME</TableHead>
              <TableHead className="font-mono text-xs">TYPE</TableHead>
              <TableHead className="font-mono text-xs">SEVERITY</TableHead>
              <TableHead className="font-mono text-xs">SOURCE IP</TableHead>
              <TableHead className="font-mono text-xs">ENDPOINT</TableHead>
              <TableHead className="font-mono text-xs">METHOD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground font-mono text-sm">
                      Loading logs...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow
                  key={log._id}
                  className={`hover:bg-muted/20 transition-colors ${
                    index === 0 ? "animate-slide-up bg-primary/5" : ""
                  }`}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {format(new Date(log.createdAt), "HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-mono text-xs font-medium ${
                        attackTypeColors[log.attackType] || "text-foreground"
                      }`}
                    >
                      {log.attackType.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={log.severity} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 text-xs font-mono bg-muted rounded">
                      {log.method}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
