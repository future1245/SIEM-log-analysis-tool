import { useState } from 'react';
import { Alert } from '@/types/siem';
import { SeverityBadge } from './SeverityBadge';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertsTableProps {
  alerts: Alert[];
}

export function AlertsTable({ alerts }: AlertsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-secondary/50">
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="w-8 px-4 py-3"></th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Detection Type</th>
            <th className="px-4 py-3">Service / User / IP</th>
            <th className="px-4 py-3">Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isExpanded={expandedId === alert.id}
              onToggle={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface AlertRowProps {
  alert: Alert;
  isExpanded: boolean;
  onToggle: () => void;
}

function AlertRow({ alert, isExpanded, onToggle }: AlertRowProps) {
  const identifier = alert.user || alert.sourceIp || alert.service || '-';

  return (
    <>
      <tr 
        className={cn(
          'hover:bg-secondary/30 cursor-pointer transition-colors',
          isExpanded && 'bg-secondary/30'
        )}
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </td>
        <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
          {new Date(alert.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </td>
        <td className="px-4 py-3">
          <SeverityBadge severity={alert.severity} size="sm" />
        </td>
        <td className="px-4 py-3 text-sm text-foreground">
          {alert.detectionType.replace(/_/g, ' ')}
        </td>
        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
          {identifier}
        </td>
        <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
          {alert.reason}
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={6} className="bg-secondary/20">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 space-y-4"
              >
                {/* Raw Log */}
                {alert.rawLog && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Raw Log</h4>
                    <div className="log-terminal rounded p-3 overflow-x-auto">
                      <code className="text-terminal-text text-xs">{alert.rawLog}</code>
                    </div>
                  </div>
                )}

                {/* Correlated Events */}
                {alert.correlatedEvents && alert.correlatedEvents.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Correlated Events</h4>
                    <ul className="space-y-1">
                      {alert.correlatedEvents.map((event, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* MITRE ATT&CK */}
                {alert.mitreAttackId && (
                  <div className="flex items-center gap-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">MITRE ATT&CK:</span>
                    <a 
                      href={`https://attack.mitre.org/techniques/${alert.mitreAttackId.replace('.', '/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {alert.mitreAttackId}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
