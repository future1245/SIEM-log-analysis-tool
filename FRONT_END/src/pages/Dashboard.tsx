import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertCounter } from "@/components/dashboard/AlertCounter";
import { SecurityPostureIndicator } from "@/components/dashboard/SecurityPostureIndicator";
import { AlertsChart } from "@/components/dashboard/AlertsChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { Alert, SecurityPosture } from "@/types/siem";

const BACKEND = "http://127.0.0.1:5000/api";

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [posture, setPosture] = useState<SecurityPosture>("NORMAL");
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchAll();
    const i = setInterval(fetchAll, 3000);
    return () => clearInterval(i);
  }, []);

  const fetchAll = async () => {
    const [a, s, p] = await Promise.all([
      fetch(`${BACKEND}/alerts`).then(r => r.json()),
      fetch(`${BACKEND}/summary`).then(r => r.json()),
      fetch(`${BACKEND}/posture`).then(r => r.json()),
    ]);

    setAlerts(a);
    setSummary(s);

    // 🔥 NORMALIZE BACKEND → FRONTEND
    if (p.posture === "CRITICAL") setPosture("UNDER_ATTACK");
    else if (p.posture === "SUSPICIOUS") setPosture("SUSPICIOUS");
    else setPosture("NORMAL");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Security Dashboard" subtitle="Live SIEM Overview" />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <SecurityPostureIndicator status={posture} />
          </div>

          {summary && (
            <>
              <AlertCounter label="Critical" count={summary.critical} severity="critical" />
              <AlertCounter label="Alerts" count={summary.alert} severity="alert" />
              <AlertCounter label="Warnings" count={summary.warning} severity="warning" />
            </>
          )}
        </div>

        {/* Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsChart alerts={alerts} />
          <RecentAlerts alerts={alerts.slice(-5).reverse()} />
        </div>
      </div>
    </div>
  );
}
