import { Header } from '@/components/layout/Header';
import { SimulationCard } from '@/components/simulations/SimulationCard';
import { mockSimulations } from '@/data/mockData';
import { AlertTriangle } from 'lucide-react';

const Simulations = () => {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Simulations" 
        subtitle="Run attack simulations to test detection capabilities" 
      />
      
      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Warning Banner */}
        <div className="p-4 rounded-lg border border-severity-warning/30 bg-severity-warning/5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-severity-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-severity-warning">Simulation Mode</h3>
            <p className="text-sm text-muted-foreground mt-1">
              These simulations trigger your backend detection engine. Alerts generated are labeled as simulation events. 
              Use in a controlled environment only.
            </p>
          </div>
        </div>

        {/* Simulations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockSimulations.map((simulation, index) => (
            <SimulationCard key={simulation.id} simulation={simulation} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Simulations;
