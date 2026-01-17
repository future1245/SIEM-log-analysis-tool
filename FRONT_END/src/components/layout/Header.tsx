import { Bell, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockAlertCounts } from '@/data/mockData';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="h-16 px-6 border-b border-border flex items-center justify-between bg-card/50">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts, logs..."
            className="w-64 pl-9 bg-secondary border-border text-sm"
          />
        </div>

        {/* Refresh */}
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          {mockAlertCounts.critical > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-severity-critical text-[10px] font-bold rounded-full flex items-center justify-center text-white">
              {mockAlertCounts.critical}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
