import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertCounter } from "@/components/dashboard/AlertCounter";
import { SeverityBadge } from "@/components/alerts/SeverityBadge";

const BACKEND_BASE = "http://127.0.0.1:5000/api";

interface Alert {
  id: string;
  timestamp: string;
  severity: string;
  detectionType: string;
  reason: string;
  service?: string | null;
  user?: string | null;
  sourceIp?: string | null;
}

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [posture, setPosture] = useState<string>("UNKNOWN");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchSummary();
    fetchPosture();
    fetchAlerts();

    const interval = setInterval(() => {
      fetchSummary();
      fetchPosture();
      fetchAlerts();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchSummary = async () => {
    const res = await fetch(`${BACKEND_BASE}/summary`);
    const data = await res.json();
    setSummary(data);
  };

  const fetchPosture = async () => {
    const res = await fetch(`${BACKEND_BASE}/posture`);
    const data = await res.json();
    setPosture(data.posture);
  };

  const fetchAlerts = async () => {
    const res = await fetch(`${BACKEND_BASE}/alerts`);
    const data = await res.json();
    setAlerts(data.slice(-5).reverse()); // last 5 alerts
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="SIEM overview & security posture"
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Security Posture */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Security Posture
          </h3>
          <div className="text-2xl font-bold">
            {posture}
          </div>
        </div>

        {/* Alert Counters */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AlertCounter label="Critical" count={summary.critical} severity="critical" />
            <AlertCounter label="Alerts" count={summary.alert} severity="alert" />
            <AlertCounter label="Warnings" count={summary.warning} severity="warning" />
            <AlertCounter label="Info" count={summary.info} severity="info" />
          </div>
        )}

        {/* Recent Alerts */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
              Recent Alerts
            </h3>
          </div>

          <div className="divide-y divide-border">
            {alerts.length === 0 && (
              <div className="px-6 py-4 text-muted-foreground text-sm">
                No alerts received yet
              </div>
            )}

            {alerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    {alert.detectionType}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {alert.reason}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs text-muted-foreground font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
