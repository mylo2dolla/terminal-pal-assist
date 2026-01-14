import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { ServerMetricsPanel } from '@/components/ServerMetricsPanel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useServerMetrics } from '@/hooks/useServerMetrics';
import { 
  RefreshCw, 
  Activity,
  Loader2,
  ArrowLeft,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Metrics = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    servers, 
    loading: metricsLoading, 
    lastRefresh,
    fetchMetrics,
    refreshAllMetrics,
  } = useServerMetrics(15000); // Refresh every 15 seconds

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await refreshAllMetrics();
    setRefreshing(false);
  };

  // Calculate aggregate stats
  const serversWithMetrics = servers.filter(s => s.metrics);
  const avgCpu = serversWithMetrics.length > 0
    ? serversWithMetrics.reduce((sum, s) => sum + (s.metrics?.cpu || 0), 0) / serversWithMetrics.length
    : 0;
  const avgMemory = serversWithMetrics.length > 0
    ? serversWithMetrics.reduce((sum, s) => sum + (s.metrics?.memory.percentage || 0), 0) / serversWithMetrics.length
    : 0;
  const avgDisk = serversWithMetrics.length > 0
    ? serversWithMetrics.reduce((sum, s) => sum + (s.metrics?.disk.percentage || 0), 0) / serversWithMetrics.length
    : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header />
      
      <main className="pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-primary font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              home
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-mono">metrics</span>
          </div>

          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                <Gauge className="w-8 h-8 text-primary" />
                <span className="text-glow">Live Metrics</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm mt-1">
                &gt; real-time server performance monitoring
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">
                Updated: {lastRefresh.toLocaleTimeString()}
              </span>
              <Button
                variant="outline"
                onClick={handleRefreshAll}
                disabled={refreshing || servers.length === 0}
                className="font-mono border-primary/30 text-muted-foreground hover:text-primary hover:border-primary/50"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
                Refresh All
              </Button>
            </div>
          </div>

          {/* Aggregate Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
                <Server className="w-3 h-3" />
                MONITORED
              </div>
              <div className="text-2xl font-bold text-foreground">{serversWithMetrics.length}</div>
            </div>
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
                <Cpu className="w-3 h-3" />
                AVG CPU
              </div>
              <div className={cn(
                "text-2xl font-bold",
                avgCpu > 90 ? "text-destructive" : avgCpu > 70 ? "text-accent" : "text-primary"
              )}>
                {avgCpu.toFixed(1)}%
              </div>
            </div>
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
                <MemoryStick className="w-3 h-3" />
                AVG MEMORY
              </div>
              <div className={cn(
                "text-2xl font-bold",
                avgMemory > 90 ? "text-destructive" : avgMemory > 70 ? "text-accent" : "text-secondary"
              )}>
                {avgMemory.toFixed(1)}%
              </div>
            </div>
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
                <HardDrive className="w-3 h-3" />
                AVG DISK
              </div>
              <div className={cn(
                "text-2xl font-bold",
                avgDisk > 90 ? "text-destructive" : avgDisk > 70 ? "text-accent" : "text-accent"
              )}>
                {avgDisk.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Server Metrics */}
          {metricsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : servers.length === 0 ? (
            <div className="card-terminal rounded-lg border border-primary/20 p-12 text-center">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-mono text-foreground mb-2">No servers configured</h3>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                Add servers with API endpoints to monitor metrics
              </p>
              <Button
                onClick={() => navigate('/servers')}
                className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Server className="w-4 h-4 mr-2" />
                Manage Servers
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {servers.map(server => (
                <ServerMetricsPanel
                  key={server.id}
                  server={server}
                  onRefresh={fetchMetrics}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <StatusBar />
    </div>
  );
};

export default Metrics;
