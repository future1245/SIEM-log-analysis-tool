// src/types/siem.ts

export type Severity = "CRITICAL" | "ALERT" | "WARNING" | "INFO";

export type SecurityPosture =
  | "NORMAL"
  | "SUSPICIOUS"
  | "UNDER_ATTACK";

export interface Alert {
  id: string;
  timestamp: string;
  severity: Severity;
  detectionType: string;
  reason: string;
  service?: string | null;
  user?: string | null;
  sourceIp?: string | null;
}
