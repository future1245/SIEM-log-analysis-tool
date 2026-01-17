import { Header } from '@/components/layout/Header';
import { AlertsTable } from '@/components/alerts/AlertsTable';
import { mockAlerts, mockAlertCounts } from '@/data/mockData';
import { AlertCounter } from '@/components/dashboard/AlertCounter';

const Alerts = () => {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Live Alerts" 
        subtitle={`${mockAlertCounts.total} active alerts`} 
      />
      
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertCounter label="Critical" count={mockAlertCounts.critical} severity="critical" delay={0} />
          <AlertCounter label="Alerts" count={mockAlertCounts.alert} severity="alert" delay={1} />
          <AlertCounter label="Warnings" count={mockAlertCounts.warning} severity="warning" delay={2} />
        </div>

        {/* Alerts Table */}
        <AlertsTable alerts={mockAlerts} />
      </div>
    </div>
  );
};

export default Alerts;
