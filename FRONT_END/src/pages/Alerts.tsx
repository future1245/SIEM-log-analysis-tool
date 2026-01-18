import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertsTable } from "@/components/alerts/AlertsTable";
import { AlertCounter } from "@/components/dashboard/AlertCounter";
import { Alert } from "@/types/siem";

const BACKEND_URL = "http://127.0.0.1:5000/api/alerts";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();

      // 🔥 NORMALIZE backend alerts → frontend Alert type
      const normalized: Alert[] = data.map((a: any, index: number) => ({
        id: `${a.time}-${index}`,
        timestamp: a.received_at || new Date(a.time * 1000).toISOString(),
        severity: a.severity,
        detectionType: a.detection.toUpperCase().replace(/ /g, "_"),
        reason: a.reason,

        service: a.alert_type === "Service" ? a.entity : undefined,
        user: a.alert_type === "User" ? a.entity : undefined,
        sourceIp: a.alert_type === "IP" ? a.entity : undefined,
      }));

      setAlerts(normalized.reverse()); // newest first
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---- COUNTS ----
  const critical = alerts.filter(a => a.severity === "CRITICAL").length;
  const alert = alerts.filter(a => a.severity === "ALERT").length;
  const warning = alerts.filter(a => a.severity === "WARNING").length;

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Live Alerts"
        subtitle={`${alerts.length} active alerts`}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertCounter label="Critical" count={critical} severity="critical" delay={0} />
          <AlertCounter label="Alerts" count={alert} severity="alert" delay={1} />
          <AlertCounter label="Warnings" count={warning} severity="warning" delay={2} />
        </div>

        {/* Table */}
        <AlertsTable alerts={alerts} />
      </div>
    </div>
  );
};

export default Alerts;
