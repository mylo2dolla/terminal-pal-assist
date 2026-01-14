import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { ServerCard } from '@/components/ServerCard';
import { AddServerModal } from '@/components/AddServerModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useServers } from '@/hooks/useServers';
import { 
  Plus, 
  RefreshCw, 
  Server, 
  Terminal,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Servers = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    servers, 
    loading: serversLoading, 
    checkServerStatus, 
    checkAllServers,
    addServer,
    toggleServerActive,
    deleteServer,
  } = useServers();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [checkingAll, setCheckingAll] = useState(false);

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleCheckAll = async () => {
    setCheckingAll(true);
    await checkAllServers();
    setCheckingAll(false);
  };

  const handleEdit = (serverId: string) => {
    // TODO: Implement edit modal
    console.log('Edit server:', serverId);
  };

  const onlineCount = servers.filter(s => s.connectionStatus === 'online').length;
  const offlineCount = servers.filter(s => s.connectionStatus === 'offline').length;
  const activeCount = servers.filter(s => s.is_active).length;

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
            <span className="text-primary font-mono">servers</span>
          </div>

          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
                <Terminal className="w-8 h-8 text-primary" />
                <span className="text-glow">Server Management</span>
              </h1>
              <p className="text-muted-foreground font-mono text-sm mt-1">
                &gt; manage your server fleet
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCheckAll}
                disabled={checkingAll || servers.length === 0}
                className="font-mono border-primary/30 text-muted-foreground hover:text-primary hover:border-primary/50"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", checkingAll && "animate-spin")} />
                Check All
              </Button>
              <Button
                onClick={() => setAddModalOpen(true)}
                className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">TOTAL SERVERS</div>
              <div className="text-2xl font-bold text-foreground">{servers.length}</div>
            </div>
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">ACTIVE</div>
              <div className="text-2xl font-bold text-primary">{activeCount}</div>
            </div>
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">ONLINE</div>
              <div className="text-2xl font-bold text-primary">{onlineCount}</div>
            </div>
            <div className="card-terminal rounded-lg border border-primary/20 p-4">
              <div className="text-xs text-muted-foreground font-mono mb-1">OFFLINE</div>
              <div className="text-2xl font-bold text-destructive">{offlineCount}</div>
            </div>
          </div>

          {/* Server grid */}
          {serversLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : servers.length === 0 ? (
            <div className="card-terminal rounded-lg border border-primary/20 p-12 text-center">
              <Server className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-mono text-foreground mb-2">No servers configured</h3>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                Add your first server to start monitoring
              </p>
              <Button
                onClick={() => setAddModalOpen(true)}
                className="font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Server
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map(server => (
                <ServerCard
                  key={server.id}
                  server={server}
                  onCheckStatus={checkServerStatus}
                  onToggleActive={toggleServerActive}
                  onEdit={handleEdit}
                  onDelete={deleteServer}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <StatusBar />
      
      <AddServerModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen}
        onAdd={addServer}
      />
    </div>
  );
};

export default Servers;