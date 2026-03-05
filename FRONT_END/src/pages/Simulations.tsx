import { Button } from "@/components/ui/button";

const simulations = [
 {
  name: "DNS Flood",
  description:
   "Simulates high-volume DNS requests to suspicious domains to test detection of potential C2 beaconing and DNS anomalies.",
 },
 {
  name: "HTTP Flood",
  description:
   "Generates a large number of HTTP requests to simulate a web layer DoS attack and test anomaly detection.",
 },
 {
  name: "HTTPS Abuse",
  description:
   "Simulates suspicious HTTPS traffic patterns such as encrypted command-and-control communications.",
 },
 {
  name: "SSH Brute Force",
  description:
   "Generates repeated failed SSH login attempts to simulate brute force authentication attacks.",
 },
 {
  name: "Privilege Escalation",
  description:
   "Simulates a user attempting to gain elevated privileges using sudo or misconfigured permissions.",
 },
 {
  name: "Log Tampering",
  description:
   "Simulates unauthorized modification or deletion of system logs to test integrity monitoring.",
 },
 {
  name: "DNS Data Exfiltration",
  description:
   "Simulates data exfiltration through encoded DNS queries to mimic stealthy attacker techniques.",
 },
 {
  name: "Suspicious Command Execution",
  description:
   "Simulates execution of encoded or obfuscated shell commands commonly used by attackers.",
 },
];

export default function Simulations() {

 const runSimulation = async (name: string) => {
  console.log("Running simulation:", name);

  try {
   const res = await fetch("http://127.0.0.1:5000/api/simulate", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     type: name,
    }),
   });

   const data = await res.json();

   console.log("Simulation result:", data);

   alert(`${data.alerts_created} alerts generated`);

  } catch (err) {
   console.error("Simulation failed:", err);
   alert("Simulation failed. Check backend.");
  }
 };

 return (
  <div className="p-6 space-y-6">
   <div>
    <h1 className="text-2xl font-semibold">Threat Simulations</h1>
    <p className="text-muted-foreground mt-1">
     Run controlled attack scenarios to test SIEM detection capabilities.
    </p>
   </div>

   {/* Simulation Grid */}
   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {simulations.map((sim) => (
     <div
      key={sim.name}
      className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between"
     >
      <div>
       <h2 className="text-lg font-semibold">{sim.name}</h2>
       <p className="text-sm text-muted-foreground mt-2">
        {sim.description}
       </p>
      </div>

      <Button
       className="mt-4 w-full"
       onClick={() => runSimulation(sim.name)}
      >
       Run Simulation
      </Button>
     </div>
    ))}
   </div>
  </div>
 );
}