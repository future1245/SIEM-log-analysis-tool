import { useState } from 'react';
import { Simulation } from '@/types/siem';
import { Play, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/alerts/SeverityBadge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SimulationCardProps {
  simulation: Simulation;
  index: number;
}

export function SimulationCard({ simulation, index }: SimulationCardProps) {
  const [status, setStatus] = useState<'ready' | 'running' | 'completed'>(simulation.status);

  const handleRun = () => {
    setStatus('running');
    // Simulate running
    setTimeout(() => {
      setStatus('completed');
      // Reset after a while
      setTimeout(() => setStatus('ready'), 3000);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'stat-card',
        status === 'running' && 'border-primary/50',
        status === 'completed' && 'border-severity-success/50'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{simulation.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">{simulation.id}</p>
        </div>
        <Button
          size="sm"
          onClick={handleRun}
          disabled={status === 'running'}
          className={cn(
            'gap-2',
            status === 'completed' && 'bg-severity-success hover:bg-severity-success/90'
          )}
        >
          {status === 'ready' && <Play className="w-3 h-3" />}
          {status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'completed' && <CheckCircle className="w-3 h-3" />}
          {status === 'ready' && 'Run'}
          {status === 'running' && 'Running...'}
          {status === 'completed' && 'Done'}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{simulation.description}</p>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Expected Alerts</h4>
        <div className="flex flex-wrap gap-2">
          {simulation.expectedAlerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1 rounded bg-secondary">
              <SeverityBadge severity={alert.severity} size="sm" />
              <span className="text-xs text-muted-foreground">{alert.type.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
