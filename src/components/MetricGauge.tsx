import { cn } from '@/lib/utils';

interface MetricGaugeProps {
  value: number;
  label: string;
  unit?: string;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive';
}

export const MetricGauge = ({
  value,
  label,
  unit = '%',
  maxValue = 100,
  size = 'md',
  showPercentage = true,
  color = 'primary',
}: MetricGaugeProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getColorClass = () => {
    if (percentage > 90) return 'text-destructive';
    if (percentage > 70) return 'text-accent';
    return `text-${color}`;
  };

  const getBarColorClass = () => {
    if (percentage > 90) return 'bg-destructive';
    if (percentage > 70) return 'bg-accent';
    return `bg-${color}`;
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const displayValue = showPercentage ? percentage.toFixed(1) : value.toFixed(1);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className={cn("font-mono font-bold text-sm", getColorClass())}>
          {displayValue}{unit}
        </span>
      </div>
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getBarColorClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
