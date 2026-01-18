import { Alert } from "@/types/siem";
import { SeverityBadge } from "@/components/alerts/SeverityBadge";

interface RecentAlertsProps {
  alerts: Alert[];
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
          Recent Alerts
        </h3>
      </div>

      {alerts.length === 0 && (
        <div className="px-6 py-4 text-sm text-muted-foreground">
          No alerts yet
        </div>
      )}

      <div className="divide-y divide-border">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="px-6 py-4 flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-medium">
                {alert.detectionType}
              </div>
              <div className="text-xs text-muted-foreground">
                {alert.reason}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SeverityBadge severity={alert.severity} size="sm" />
              <div className="text-xs text-muted-foreground font-mono">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
