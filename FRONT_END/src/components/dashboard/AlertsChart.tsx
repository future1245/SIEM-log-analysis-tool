import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AlertsChartProps {
  data: {
    time: string;
    critical: number;
    alert: number;
    warning: number;
  }[];
}

const chartConfig = {
  critical: {
    label: "Critical",
    color: "hsl(0, 72%, 51%)",
  },
  alert: {
    label: "Alert",
    color: "hsl(25, 95%, 53%)",
  },
  warning: {
    label: "Warning",
    color: "hsl(48, 96%, 53%)",
  },
};

export function AlertsChart({ data }: AlertsChartProps) {
  return (
    <div className="stat-card">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Alerts Over Time (24h)
      </h3>

      {/* 🔒 FIXED HEIGHT CONTAINER */}
      <div className="h-[220px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar dataKey="critical" stackId="a" fill="var(--color-critical)" />
              <Bar dataKey="alert" stackId="a" fill="var(--color-alert)" />
              <Bar dataKey="warning" stackId="a" fill="var(--color-warning)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
