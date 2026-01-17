import { Detection } from '@/types/siem';
import { ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DetectionCardProps {
  detection: Detection;
  index: number;
}

export function DetectionCard({ detection, index }: DetectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="stat-card hover:border-primary/50 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{detection.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {detection.type}
            </p>
          </div>
        </div>
        <a
          href={`https://attack.mitre.org/techniques/${detection.mitreAttackId.replace('.', '/')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 rounded bg-severity-info/10 text-severity-info text-xs font-mono flex items-center gap-1 hover:bg-severity-info/20 transition-colors"
        >
          {detection.mitreAttackId}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">What It Detects</h4>
          <p className="text-sm text-secondary-foreground">{detection.description}</p>
        </div>

        <div className="p-3 rounded-lg bg-severity-alert/5 border border-severity-alert/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-severity-alert" />
            <h4 className="text-xs uppercase tracking-wider text-severity-alert">Why It Matters</h4>
          </div>
          <p className="text-sm text-muted-foreground">{detection.whyItMatters}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded bg-secondary text-xs text-muted-foreground">
            {detection.mitreAttackName}
          </span>
          <span className="px-2 py-1 rounded bg-secondary text-xs text-muted-foreground">
            Tactic: {detection.mitreTactic}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
