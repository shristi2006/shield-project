import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useSocket } from "@/hooks/useSocket";
import type { Incident } from "@/types/incident.types";

export default function IncidentView() {
  const socket = useSocket();

  const { incidentId } = useParams<{ incidentId: string }>();

  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (!incidentId) return;

    socket.on("incident:update", (updated: Incident) => {
      if (updated._id === incidentId) {
        setIncident(updated);
      }
    });

    return () => {
      socket.off("incident:update");
    };
  }, [socket, incidentId]);

  if (!incident) {
    return <div>Loading incident...</div>;
  }

  return (
    <div>
      <h1>Incident {incident._id}</h1>
      <p>Status: {incident.status}</p>
      <p>Priority: {incident.priority}</p>
      <p>Logs: {incident.logs.length}</p>
    </div>
  );
}
