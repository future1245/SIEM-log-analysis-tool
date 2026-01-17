// SIEM Data Types

export type SeverityLevel = 'CRITICAL' | 'ALERT' | 'WARNING' | 'INFO';

export type SecurityPosture = 'NORMAL' | 'SUSPICIOUS' | 'UNDER_ATTACK';

export type LogSource = 'syslog' | 'auth' | 'suricata';

export type DetectionType = 
  | 'PRIVILEGE_ESCALATION'
  | 'SERVICE_RESTART_ABUSE'
  | 'DNS_ANOMALY'
  | 'HTTP_ANOMALY'
  | 'HTTPS_ANOMALY'
  | 'TIME_MANIPULATION'
  | 'LOG_TAMPERING'
  | 'BRUTE_FORCE'
  | 'SUSPICIOUS_COMMAND';

export interface Alert {
  id: string;
  timestamp: string;
  severity: SeverityLevel;
  detectionType: DetectionType;
  service?: string;
  user?: string;
  sourceIp?: string;
  destinationIp?: string;
  reason: string;
  rawLog?: string;
  correlatedEvents?: string[];
  mitreAttackId?: string;
}

export interface UnifiedLog {
  id: string;
  timestamp: string;
  source: LogSource;
  service: string;
  message: string;
  user?: string;
  ip?: string;
  severity?: SeverityLevel;
}

export interface Detection {
  type: DetectionType;
  name: string;
  description: string;
  whyItMatters: string;
  mitreAttackId: string;
  mitreAttackName: string;
  mitreTactic: string;
}

export interface Simulation {
  id: string;
  name: string;
  description: string;
  expectedAlerts: {
    severity: SeverityLevel;
    type: DetectionType;
  }[];
  status: 'ready' | 'running' | 'completed';
}

export interface TimelineEvent {
  timestamp: string;
  severity: SeverityLevel;
  label: string;
}

export interface AlertCounts {
  critical: number;
  alert: number;
  warning: number;
  info: number;
  total: number;
}
