import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertCounter } from "@/components/dashboard/AlertCounter";
import { AlertsChart } from "@/components/dashboard/AlertsChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { SecurityPostureIndicator } from "@/components/dashboard/SecurityPostureIndicator";

const BACKEND = "http://127.0.0.1:5000/api";

export default function Dashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [posture, setPosture] = useState<"NORMAL" | "SUSPICIOUS" | "UNDER_ATTACK">("NORMAL");

  useEffect(() => {
    fetchAll();
    const i = setInterval(fetchAll, 3000);
    return () => clearInterval(i);
  }, []);

  const fetchAll = async () => {
    const alertsRes = await fetch(`${BACKEND}/alerts`);
    const summaryRes = await fetch(`${BACKEND}/summary`);
    const postureRes = await fetch(`${BACKEND}/posture`);

    const alertsData = await alertsRes.json();
    const summaryData = await summaryRes.json();
    const postureData = await postureRes.json();

    setAlerts(alertsData);
    setSummary(summaryData);
    setPosture(postureData.posture);
  };

  /* 🔹 BUILD CHART DATA (GROUP BY TIME) */
  const chartData = [
    { time: "00-04", critical: 0, alert: 0, warning: 0 },
    { time: "04-08", critical: 0, alert: 0, warning: 0 },
    { time: "08-12", critical: 0, alert: 0, warning: 0 },
    { time: "12-16", critical: 0, alert: 0, warning: 0 },
    { time: "16-20", critical: 0, alert: 0, warning: 0 },
    { time: "20-24", critical: 0, alert: 0, warning: 0 },
  ];

  alerts.forEach((a) => {
    const hour = new Date(a.timestamp).getUTCHours();
    const index = Math.floor(hour / 4);
    if (a.severity === "CRITICAL") chartData[index].critical++;
    if (a.severity === "ALERT") chartData[index].alert++;
    if (a.severity === "WARNING") chartData[index].warning++;
  });

  return (
    <div className="flex flex-col h-full">
      <Header title="Security Dashboard" subtitle="Live SIEM Overview" />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* TOP */}
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

        {/* BOTTOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsChart data={chartData} />
          <RecentAlerts alerts={alerts.slice(-5).reverse()} />
        </div>
      </div>
    </div>
  );
}
