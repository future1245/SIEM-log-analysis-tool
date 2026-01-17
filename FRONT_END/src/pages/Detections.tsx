import { Header } from '@/components/layout/Header';
import { DetectionCard } from '@/components/detections/DetectionCard';
import { mockDetections } from '@/data/mockData';

const Detections = () => {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Detections" 
        subtitle="Detection rules with MITRE ATT&CK mapping" 
      />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockDetections.map((detection, index) => (
            <DetectionCard key={detection.type} detection={detection} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detections;
