import React from "react";
import { IncidentsTable } from "@/components/dashboard/IncidentsTable";

const AdminIncidents: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Incident Management</h1>
        <p className="text-muted-foreground text-sm font-mono">
          Manage all incidents and assign to analysts
        </p>
      </div>

      <IncidentsTable isAdmin={true} />
    </div>
  );
};

export default AdminIncidents;
