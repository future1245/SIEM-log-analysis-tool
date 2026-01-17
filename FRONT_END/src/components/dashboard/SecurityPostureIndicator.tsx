import { Shield, AlertTriangle, Skull } from 'lucide-react';
import { SecurityPosture } from '@/types/siem';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SecurityPostureIndicatorProps {
  status: SecurityPosture;
}

const postureConfig = {
  NORMAL: {
    icon: Shield,
    label: 'Normal',
    description: 'No active threats detected',
    colorClass: 'text-severity-success',
    bgClass: 'bg-severity-success/10',
    borderClass: 'border-severity-success/30',
    glowClass: 'glow-success',
  },
  SUSPICIOUS: {
    icon: AlertTriangle,
    label: 'Suspicious',
    description: 'Anomalous activity detected',
    colorClass: 'text-severity-alert',
    bgClass: 'bg-severity-alert/10',
    borderClass: 'border-severity-alert/30',
    glowClass: 'glow-alert',
  },
  UNDER_ATTACK: {
    icon: Skull,
    label: 'Under Attack',
    description: 'Active threat in progress',
    colorClass: 'text-severity-critical',
    bgClass: 'bg-severity-critical/10',
    borderClass: 'border-severity-critical/30',
    glowClass: 'glow-critical pulse-critical',
  },
};

export function SecurityPostureIndicator({ status }: SecurityPostureIndicatorProps) {
  const config = postureConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'stat-card flex items-center gap-4',
        config.bgClass,
        config.borderClass,
        config.glowClass
      )}
    >
      <div className={cn('p-3 rounded-lg', config.bgClass)}>
        <Icon className={cn('w-8 h-8', config.colorClass)} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Security Posture</p>
        <p className={cn('text-xl font-bold', config.colorClass)}>{config.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
      </div>
    </motion.div>
  );
}
