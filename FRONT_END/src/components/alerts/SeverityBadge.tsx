import { SeverityLevel } from '@/types/siem';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
}

const severityClasses: Record<SeverityLevel, string> = {
  CRITICAL: 'severity-badge-critical',
  ALERT: 'severity-badge-alert',
  WARNING: 'severity-badge-warning',
  INFO: 'severity-badge-info',
};

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded font-semibold uppercase',
      severityClasses[severity],
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
    )}>
      {severity}
    </span>
  );
}
