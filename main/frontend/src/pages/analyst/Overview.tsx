import React, { useEffect, useState } from "react";
import { FileText, AlertTriangle, Activity, ShieldAlert } from "lucide-react";
import { getOverview } from "@/services/dashboard.service";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttackTimelineChart } from "@/components/dashboard/AttackTimelineChart";
import { SeverityChart } from "@/components/dashboard/SeverityChart";
import { GeoMap } from "@/components/dashboard/GeoMap";
import type { OverviewMetrics } from "@/types/api";

const AnalystOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getOverview();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Security Overview</h1>
        <p className="text-muted-foreground text-sm font-mono">
          Real-time threat monitoring and analysis
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          title="Threat Level"
          value={
            isLoading
              ? "—"
              : (metrics?.criticalAttacks || 0) > 10
              ? "HIGH"
              : (metrics?.criticalAttacks || 0) > 5
              ? "MEDIUM"
              : "LOW"
          }
          icon={Activity}
          variant={
            (metrics?.criticalAttacks || 0) > 10
              ? "critical"
              : (metrics?.criticalAttacks || 0) > 5
              ? "warning"
              : "success"
          }
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

export default AnalystOverview;
