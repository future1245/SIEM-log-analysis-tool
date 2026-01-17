import { TimelineEvent, SeverityLevel } from '@/types/siem';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DetectionTimelineProps {
  events: TimelineEvent[];
}

const severityDotColors: Record<SeverityLevel, string> = {
  CRITICAL: 'bg-severity-critical',
  ALERT: 'bg-severity-alert',
  WARNING: 'bg-severity-warning',
  INFO: 'bg-severity-info',
};

const severityTextColors: Record<SeverityLevel, string> = {
  CRITICAL: 'text-severity-critical',
  ALERT: 'text-severity-alert',
  WARNING: 'text-severity-warning',
  INFO: 'text-severity-info',
};

export function DetectionTimeline({ events }: DetectionTimelineProps) {
  return (
    <div className="stat-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">Detection Timeline</h3>
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 group"
          >
            <span className="text-xs font-mono text-muted-foreground w-12">{event.timestamp}</span>
            <div className={cn('w-2 h-2 rounded-full', severityDotColors[event.severity])} />
            <span className={cn(
              'text-sm flex-1 truncate group-hover:text-foreground transition-colors',
              severityTextColors[event.severity]
            )}>
              {event.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
