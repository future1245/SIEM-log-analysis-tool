import { Header } from '@/components/layout/Header';
import { TimeTamperingIndicators } from '@/components/time-manipulation/TimeTamperingIndicators';

const TimeManipulation = () => {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Time Manipulation & Log Tampering" 
        subtitle="Monitor log integrity and detect anti-forensics techniques" 
      />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl">
          <TimeTamperingIndicators />
        </div>
      </div>
    </div>
  );
};

export default TimeManipulation;
