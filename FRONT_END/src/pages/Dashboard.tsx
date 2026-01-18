import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { AlertCounter } from "@/components/dashboard/AlertCounter";

type Alert = {
  severity: "CRITICAL" | "ALERT" | "WARNING" | "INFO";
};

const Dashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const counts = {
    critical: alerts.filter(a => a.severity === "CRITICAL").length,
    alert: alerts.filter(a => a.severity === "ALERT").length,
    warning: alerts.filter(a => a.severity === "WARNING").length,
    info: alerts.filter(a => a.severity === "INFO").length,
    total: alerts.length
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Security Dashboard"
        subtitle={`${counts.total} total alerts`}
      />

      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <AlertCounter label="Critical" count={counts.critical} severity="critical" delay={0} />
        <AlertCounter label="Alerts" count={counts.alert} severity="alert" delay={1} />
        <AlertCounter label="Warnings" count={counts.warning} severity="warning" delay={2} />
        <AlertCounter label="Info" count={counts.info} severity="info" delay={3} />
      </div>
    </div>
  );
};

export default Dashboard;
