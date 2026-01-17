import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AlertCounterProps {
  label: string;
  count: number;
  severity: 'critical' | 'alert' | 'warning' | 'info';
  delay?: number;
}

const severityColors = {
  critical: {
    text: 'text-severity-critical',
    bg: 'bg-severity-critical/10',
    border: 'border-severity-critical/30',
  },
  alert: {
    text: 'text-severity-alert',
    bg: 'bg-severity-alert/10',
    border: 'border-severity-alert/30',
  },
  warning: {
    text: 'text-severity-warning',
    bg: 'bg-severity-warning/10',
    border: 'border-severity-warning/30',
  },
  info: {
    text: 'text-severity-info',
    bg: 'bg-severity-info/10',
    border: 'border-severity-info/30',
  },
};

export function AlertCounter({ label, count, severity, delay = 0 }: AlertCounterProps) {
  const colors = severityColors[severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={cn(
        'stat-card',
        colors.bg,
        colors.border
      )}
    >
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
      <p className={cn('text-3xl font-bold font-mono', colors.text)}>{count}</p>
    </motion.div>
  );
}
