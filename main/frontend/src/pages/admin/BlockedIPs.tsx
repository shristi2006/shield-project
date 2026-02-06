import React from "react";
import { BlockedIPsTable } from "@/components/dashboard/BlockedIPsTable";

const AdminBlockedIPs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Blocked IP Management</h1>
        <p className="text-muted-foreground text-sm font-mono">
          View and manage blocked IP addresses
        </p>
      </div>

      <BlockedIPsTable />
    </div>
  );
};

export default AdminBlockedIPs;
