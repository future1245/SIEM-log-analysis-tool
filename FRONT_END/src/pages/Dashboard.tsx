import { Header } from '@/components/layout/Header';
import { SecurityPostureIndicator } from '@/components/dashboard/SecurityPostureIndicator';
import { AlertCounter } from '@/components/dashboard/AlertCounter';
import { DetectionTimeline } from '@/components/dashboard/DetectionTimeline';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { mockSecurityPosture, mockAlertCounts, mockTimelineEvents, mockAlerts } from '@/data/mockData';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="Security Dashboard" 
        subtitle={`Last updated: ${new Date().toLocaleTimeString()}`} 
      />
      
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Top Section: Posture + Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <SecurityPostureIndicator status={mockSecurityPosture} />
          </div>
          <AlertCounter label="Critical" count={mockAlertCounts.critical} severity="critical" delay={1} />
          <AlertCounter label="Alerts" count={mockAlertCounts.alert} severity="alert" delay={2} />
          <AlertCounter label="Warnings" count={mockAlertCounts.warning} severity="warning" delay={3} />
        </div>

        {/* Total Events */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Total Events (24h)</p>
              <p className="text-3xl font-bold font-mono text-foreground">{mockAlertCounts.total}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Detection Engine</p>
              <p className="text-sm font-semibold text-severity-success">Active</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Timeline + Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DetectionTimeline events={mockTimelineEvents} />
          <RecentAlerts alerts={mockAlerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
