import { Clock, RefreshCw, FileWarning, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Indicator {
  type: 'time_change' | 'service_restart' | 'log_rotation';
  timestamp: string;
  severity: 'critical' | 'alert' | 'warning';
  details: string;
}

const mockIndicators: Indicator[] = [
  {
    type: 'time_change',
    timestamp: '2024-01-17T14:10:22Z',
    severity: 'critical',
    details: 'System time changed by +7200 seconds (2 hours)',
  },
  {
    type: 'service_restart',
    timestamp: '2024-01-17T14:28:44Z',
    severity: 'alert',
    details: 'rsyslog service restarted 5 times in 10 minutes',
  },
  {
    type: 'log_rotation',
    timestamp: '2024-01-17T13:58:45Z',
    severity: 'warning',
    details: 'Unexpected log rotation outside scheduled window',
  },
];

const trustLevel = 65; // Percentage

const iconMap = {
  time_change: Clock,
  service_restart: RefreshCw,
  log_rotation: FileWarning,
};

const severityColors = {
  critical: 'border-severity-critical bg-severity-critical/10 text-severity-critical',
  alert: 'border-severity-alert bg-severity-alert/10 text-severity-alert',
  warning: 'border-severity-warning bg-severity-warning/10 text-severity-warning',
};

export function TimeTamperingIndicators() {
  return (
    <div className="space-y-6">
      {/* Trust Level Indicator */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Log Trust Level</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Confidence in log integrity based on detected anomalies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-severity-warning" />
            <span className="text-2xl font-bold font-mono text-severity-warning">{trustLevel}%</span>
          </div>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${trustLevel}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              trustLevel >= 80 && 'bg-severity-success',
              trustLevel >= 50 && trustLevel < 80 && 'bg-severity-warning',
              trustLevel < 50 && 'bg-severity-critical'
            )}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Compromised</span>
          <span>Degraded</span>
          <span>Trusted</span>
        </div>
      </div>

      {/* Indicators List */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Detected Indicators</h3>
        <div className="space-y-3">
          {mockIndicators.map((indicator, index) => {
            const Icon = iconMap[indicator.type];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'p-4 rounded-lg border',
                  severityColors[indicator.severity]
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {indicator.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-mono opacity-70">
                        {new Date(indicator.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">{indicator.details}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Trust Degradation Timeline */}
      <div className="stat-card">
        <h3 className="text-sm font-semibold text-foreground mb-4">Trust Degradation Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {[
              { time: '14:32', trust: 100, event: 'Baseline established' },
              { time: '14:28', trust: 85, event: 'Service restart detected' },
              { time: '14:10', trust: 65, event: 'Time manipulation detected' },
              { time: '13:58', trust: 60, event: 'Unexpected log rotation' },
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 relative pl-8"
              >
                <div className={cn(
                  'absolute left-2.5 w-3 h-3 rounded-full border-2 bg-background',
                  point.trust >= 80 && 'border-severity-success',
                  point.trust >= 50 && point.trust < 80 && 'border-severity-warning',
                  point.trust < 50 && 'border-severity-critical'
                )} />
                <span className="text-xs font-mono text-muted-foreground w-12">{point.time}</span>
                <div className="flex-1">
                  <span className="text-sm text-foreground">{point.event}</span>
                </div>
                <span className={cn(
                  'text-sm font-mono font-semibold',
                  point.trust >= 80 && 'text-severity-success',
                  point.trust >= 50 && point.trust < 80 && 'text-severity-warning',
                  point.trust < 50 && 'text-severity-critical'
                )}>
                  {point.trust}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
