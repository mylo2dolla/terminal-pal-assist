import { Cpu, HardDrive, MemoryStick, Clock, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { MetricGauge } from './MetricGauge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { ServerWithMetrics } from '@/hooks/useServerMetrics';

interface ServerMetricsPanelProps {
  server: ServerWithMetrics;
  onRefresh: (serverId: string) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} TB`;
  if (bytes >= 1) return `${bytes.toFixed(1)} GB`;
  return `${(bytes * 1024).toFixed(0)} MB`;
};

const formatUptime = (seconds?: number) => {
  if (!seconds) return 'N/A';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};

const getStatus = (percentage: number): 'normal' | 'warning' | 'critical' => {
  if (percentage > 90) return 'critical';
  if (percentage > 70) return 'warning';
  return 'normal';
};

export const ServerMetricsPanel = ({ server, onRefresh }: ServerMetricsPanelProps) => {
  const { metrics, loading, error, nickname, host, is_active } = server;

  if (!server.api_endpoint) {
    return (
      <div className="card-terminal rounded-lg border border-muted p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
          <h3 className="font-mono text-lg text-foreground">{nickname}</h3>
        </div>
        <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No API endpoint configured
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "card-terminal rounded-lg border border-primary/20 p-6 transition-all duration-300",
      !is_active && "opacity-60"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-3 h-3 rounded-full",
            metrics ? "bg-primary animate-pulse" : "bg-muted"
          )} />
          <div>
            <h3 className="font-mono text-lg text-foreground">{nickname}</h3>
            <p className="text-xs text-muted-foreground font-mono">{host}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRefresh(server.id)}
          disabled={loading}
          className="text-muted-foreground hover:text-primary"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </div>

      {error && !metrics && (
        <div className="text-sm text-destructive font-mono mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="CPU"
          icon={<Cpu className="w-4 h-4" />}
          value={metrics ? `${metrics.cpu.toFixed(1)}%` : '--'}
          loading={loading && !metrics}
          status={metrics ? getStatus(metrics.cpu) : 'normal'}
        />
        <MetricCard
          title="Memory"
          icon={<MemoryStick className="w-4 h-4" />}
          value={metrics ? `${metrics.memory.percentage.toFixed(1)}%` : '--'}
          subtitle={metrics ? formatBytes(metrics.memory.used) : undefined}
          loading={loading && !metrics}
          status={metrics ? getStatus(metrics.memory.percentage) : 'normal'}
        />
        <MetricCard
          title="Disk"
          icon={<HardDrive className="w-4 h-4" />}
          value={metrics ? `${metrics.disk.percentage.toFixed(1)}%` : '--'}
          subtitle={metrics ? formatBytes(metrics.disk.used) : undefined}
          loading={loading && !metrics}
          status={metrics ? getStatus(metrics.disk.percentage) : 'normal'}
        />
        <MetricCard
          title="Uptime"
          icon={<Clock className="w-4 h-4" />}
          value={formatUptime(metrics?.uptime)}
          loading={loading && !metrics}
        />
      </div>

      {/* Progress Bars */}
      {metrics && (
        <div className="space-y-4">
          <MetricGauge
            value={metrics.cpu}
            label="CPU Usage"
            size="md"
          />
          <MetricGauge
            value={metrics.memory.percentage}
            label={`Memory (${formatBytes(metrics.memory.used)} / ${formatBytes(metrics.memory.total)})`}
            size="md"
            color="secondary"
          />
          <MetricGauge
            value={metrics.disk.percentage}
            label={`Disk (${formatBytes(metrics.disk.used)} / ${formatBytes(metrics.disk.total)})`}
            size="md"
            color="accent"
          />
        </div>
      )}

      {/* Load Average */}
      {metrics?.loadAverage && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Activity className="w-3 h-3" />
            Load Average:
            <span className="text-foreground">
              {metrics.loadAverage.map(l => l.toFixed(2)).join(' ')}
            </span>
          </div>
        </div>
      )}

      {/* Timestamp */}
      {metrics && (
        <div className="mt-4 text-xs text-muted-foreground font-mono text-right">
          Last updated: {metrics.timestamp.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
