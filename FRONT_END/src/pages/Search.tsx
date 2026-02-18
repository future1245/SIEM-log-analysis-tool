import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";

type Alert = {
  id: string;
  timestamp: string;
  severity: string;
  detectionType: string;
  reason: string;
  service?: string;
  user?: string;
  sourceIp?: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [results, setResults] = useState<Alert[]>([]);

  // Load alerts from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/alerts")
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Backend error:", err));
  }, []);

  // Search filter
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = alerts.filter((a) =>
      a.reason?.toLowerCase().includes(q) ||
      a.detectionType?.toLowerCase().includes(q) ||
      a.user?.toLowerCase().includes(q) ||
      a.service?.toLowerCase().includes(q) ||
      a.sourceIp?.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [query, alerts]);

  return (
    <div className="flex-1 p-6">
      <Header title="Search" subtitle="Search alerts in real-time" />

      <input
        className="w-full p-3 border rounded bg-black text-white"
        placeholder="Search user, IP, reason, service..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-4 space-y-2">
        {results.map((a) => (
          <div key={a.id} className="p-3 border rounded bg-gray-900 text-sm">
            <b>{a.severity}</b> | {a.detectionType}  
            <br />
            {a.reason}
            <br />
            User: {a.user || "-"} | IP: {a.sourceIp || "-"} | Service: {a.service || "-"}
          </div>
        ))}

        {query && results.length === 0 && (
          <p className="text-gray-400 mt-3">No results found</p>
        )}
      </div>
    </div>
  );
}
