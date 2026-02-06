import React from "react";
import { IncidentsTable } from "@/components/dashboard/IncidentsTable";

const AnalystIncidents: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Incident Management</h1>
        <p className="text-muted-foreground text-sm font-mono">
          Track and respond to security incidents
        </p>
      </div>

      <IncidentsTable isAdmin={false} />
    </div>
  );
};

export default AnalystIncidents;
