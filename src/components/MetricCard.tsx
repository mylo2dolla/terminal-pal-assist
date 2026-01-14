import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
  status?: 'normal' | 'warning' | 'critical';
  children?: ReactNode;
}

export const MetricCard = ({
  title,
  icon,
  value,
  subtitle,
  loading,
  status = 'normal',
  children,
}: MetricCardProps) => {
  const statusColors = {
    normal: 'border-primary/30',
    warning: 'border-accent/50',
    critical: 'border-destructive/50',
  };

  const statusGlow = {
    normal: '',
    warning: 'shadow-[0_0_15px_hsl(var(--terminal-amber)/0.2)]',
    critical: 'shadow-[0_0_15px_hsl(var(--terminal-red)/0.2)]',
  };

  return (
    <div 
      className={cn(
        "card-terminal rounded-lg border p-4 transition-all duration-300",
        statusColors[status],
        statusGlow[status]
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          "p-1.5 rounded",
          status === 'critical' ? 'text-destructive' :
          status === 'warning' ? 'text-accent' : 'text-primary'
        )}>
          {icon}
        </div>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-1 mb-1">
            <span className={cn(
              "text-2xl font-bold font-mono",
              status === 'critical' ? 'text-destructive text-glow' :
              status === 'warning' ? 'text-accent text-glow-amber' : 'text-foreground'
            )}>
              {value}
            </span>
            {subtitle && (
              <span className="text-sm text-muted-foreground font-mono">
                {subtitle}
              </span>
            )}
          </div>
          {children}
        </>
      )}
    </div>
  );
};
