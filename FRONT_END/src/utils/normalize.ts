// src/utils/normalize.ts

export function normalizePosture(raw: string): "healthy" | "suspicious" | "critical" {
  if (!raw) return "healthy";

  const value = raw.toUpperCase();

  if (value === "CRITICAL") return "critical";
  if (value === "SUSPICIOUS") return "suspicious";
  if (value === "HEALTHY") return "healthy";

  // safe fallback
  return "healthy";
}

