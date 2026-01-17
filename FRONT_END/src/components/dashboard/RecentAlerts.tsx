import { Alert, SeverityLevel } from '@/types/siem';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentAlertsProps {
  alerts: Alert[];
}

const severityBadgeClass: Record<SeverityLevel, string> = {
  CRITICAL: 'severity-badge-critical',
  ALERT: 'severity-badge-alert',
  WARNING: 'severity-badge-warning',
  INFO: 'severity-badge-info',
};

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Alerts</h3>
        <Link 
          to="/alerts" 
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 5).map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
          >
            <span className={cn(
              'px-2 py-0.5 rounded text-[10px] font-semibold uppercase',
              severityBadgeClass[alert.severity]
            )}>
              {alert.severity}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{alert.reason}</p>
              <p className="text-xs text-muted-foreground">
                {alert.user && `User: ${alert.user}`}
                {alert.user && alert.service && ' • '}
                {alert.service && `Service: ${alert.service}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
