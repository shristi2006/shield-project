import React, { useEffect, useState } from "react";
import { FileText, AlertTriangle, Activity, ShieldAlert, ShieldBan } from "lucide-react";
import { getOverview } from "@/services/dashboard.service";
import { getBlockedIPs } from "@/services/blockedIP.service";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttackTimelineChart } from "@/components/dashboard/AttackTimelineChart";
import { SeverityChart } from "@/components/dashboard/SeverityChart";
import { GeoMap } from "@/components/dashboard/GeoMap";
import type { OverviewMetrics } from "@/types/api";

const AdminOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [blockedCount, setBlockedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, blockedData] = await Promise.all([
          getOverview(),
          getBlockedIPs(),
        ]);
        setMetrics(overviewData);
        setBlockedCount(blockedData.length);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm font-mono">
          System-wide security monitoring and control
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Logs"
          value={isLoading ? "—" : metrics?.totalLogs || 0}
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Active Incidents"
          value={isLoading ? "—" : metrics?.activeIncidents || 0}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Critical Attacks"
          value={isLoading ? "—" : metrics?.criticalAttacks || 0}
          icon={ShieldAlert}
          variant="critical"
        />
        <StatCard
          title="Blocked IPs"
          value={isLoading ? "—" : blockedCount}
          icon={ShieldBan}
          variant="critical"
        />
        <StatCard
          title="System Status"
          value="OPERATIONAL"
          icon={Activity}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Attack Timeline</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Security events over the last 60 minutes
          </p>
          <AttackTimelineChart />
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Breakdown by threat level
          </p>
          <SeverityChart />
        </div>
      </div>

      {/* Geo Map */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Global Attack Map</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Real-time visualization of attack origins
        </p>
        <GeoMap className="h-[400px]" />
      </div>
    </div>
  );
};

export default AdminOverview;
