import { Alert } from "@/types/siem";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AlertsChartProps {
  alerts: Alert[];
}

export function AlertsChart({ alerts }: AlertsChartProps) {
  // bucket alerts by hour
  const buckets: Record<string, any> = {};

  alerts.forEach((a) => {
    const hour = new Date(a.timestamp).getHours().toString().padStart(2, "0") + ":00";

    if (!buckets[hour]) {
      buckets[hour] = { time: hour, critical: 0, alert: 0, warning: 0 };
    }

    if (a.severity === "CRITICAL") buckets[hour].critical++;
    if (a.severity === "ALERT") buckets[hour].alert++;
    if (a.severity === "WARNING") buckets[hour].warning++;
  });

  const chartData = Object.values(buckets);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold mb-4">
        Alerts Over Time
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="critical" stackId="a" fill="#ef4444" />
          <Bar dataKey="alert" stackId="a" fill="#f97316" />
          <Bar dataKey="warning" stackId="a" fill="#eab308" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
