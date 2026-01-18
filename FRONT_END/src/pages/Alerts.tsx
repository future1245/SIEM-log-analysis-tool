import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertsTable } from "@/components/alerts/AlertsTable";
import { AlertCounter } from "@/components/dashboard/AlertCounter";
import type { Alert } from "@/types/siem";

const BACKEND_URL = "http://127.0.0.1:5000/api/alerts";

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data: Alert[] = await res.json();
      setAlerts(data.reverse()); // newest first
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertCounter label="Critical" count={critical} severity="critical" />
          <AlertCounter label="Alerts" count={alert} severity="alert" />
          <AlertCounter label="Warnings" count={warning} severity="warning" />
        </div>

        <AlertsTable alerts={alerts} />
      </div>
    </div>
  );
}
