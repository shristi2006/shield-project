import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import type { Log } from "@/types/log.types";
import type { Incident } from "@/types/incident.types";
import { toast } from "react-toastify";

export default function Dashboard() {
  const socket = useSocket();
  const [logs, setLogs] = useState<Log[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    socket.on("log:new", (log) => {
      setLogs(prev => [log, ...prev].slice(0, 50));
    });

    socket.on("incident:new", (incident) => {
      setIncidents(prev => [incident, ...prev]);
    });

    socket.on("attack:blocked", ({ ip }) => {
      toast.error(`Blocked IP: ${ip}`);
    });

    return () => {
      socket.off("log:new");
      socket.off("incident:new");
      socket.off("attack:blocked");
    };
  }, [socket]);

  return (
    <>
      {/* KPIs, Charts, Map */}
    </>
  );
}
