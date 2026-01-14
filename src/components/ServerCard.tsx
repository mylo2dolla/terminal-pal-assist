import { useState } from 'react';
import { 
  Server, 
  RefreshCw, 
  Power, 
  Trash2, 
  Edit2, 
  Globe, 
  Clock,
  Wifi,
  WifiOff,
  Loader2,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ServerCardProps {
  server: {
    id: string;
    nickname: string;
    host: string;
    port: number | null;
    username: string | null;
    api_endpoint: string | null;
    description: string | null;
    is_active: boolean | null;
    connectionStatus: 'online' | 'offline' | 'checking' | 'unknown';
    lastChecked?: Date;
    latency?: number;
  };
  onCheckStatus: (id: string) => void;
  onToggleActive: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  online: { 
    color: 'bg-primary', 
    textColor: 'text-primary', 
    label: 'ONLINE',
    icon: Wifi,
  },
  offline: { 
    color: 'bg-destructive', 
    textColor: 'text-destructive', 
    label: 'OFFLINE',
    icon: WifiOff,
  },
  checking: { 
    color: 'bg-accent', 
    textColor: 'text-accent', 
    label: 'CHECKING',
    icon: Loader2,
  },
  unknown: { 
    color: 'bg-muted-foreground', 
    textColor: 'text-muted-foreground', 
    label: 'UNKNOWN',
    icon: Globe,
  },
};

export const ServerCard = ({ 
  server, 
  onCheckStatus, 
  onToggleActive, 
  onEdit, 
  onDelete 
}: ServerCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const status = statusConfig[server.connectionStatus];
  const StatusIcon = status.icon;

  return (
    <>
      <div 
        className={cn(
          "group relative card-terminal rounded-lg border p-5",
          "transition-all duration-300",
          server.is_active 
            ? "border-primary/30 hover:border-primary/60 hover:shadow-[0_0_30px_hsl(var(--terminal-green)_/_0.15)]" 
            : "border-muted/30 opacity-60"
        )}
      >
        {/* Status indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className={cn("text-xs font-mono", status.textColor)}>{status.label}</span>
          <div className={cn(
            "w-2 h-2 rounded-full",
            status.color,
            server.connectionStatus === 'online' && "animate-pulse",
            server.connectionStatus === 'checking' && "animate-spin"
          )} />
        </div>

        {/* Server icon and info */}
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
            "bg-primary/10 border border-primary/30",
            !server.is_active && "bg-muted/10 border-muted/30"
          )}>
            <Server className={cn("w-6 h-6", server.is_active ? "text-primary" : "text-muted-foreground")} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-mono text-lg font-semibold truncate",
              server.is_active ? "text-foreground" : "text-muted-foreground"
            )}>
              {server.nickname}
            </h3>
            <p className="font-mono text-sm text-muted-foreground truncate">
              {server.username ? `${server.username}@` : ''}{server.host}:{server.port || 22}
            </p>
            {server.description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{server.description}</p>
            )}
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            {server.api_endpoint && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{server.api_endpoint}</span>
              </div>
            )}
            {server.latency !== undefined && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{server.latency}ms</span>
              </div>
            )}
            {server.lastChecked && (
              <div className="flex items-center gap-1 text-muted-foreground/60">
                <span>checked {formatTimeAgo(server.lastChecked)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => onCheckStatus(server.id)}
              disabled={server.connectionStatus === 'checking'}
            >
              <RefreshCw className={cn("w-4 h-4", server.connectionStatus === 'checking' && "animate-spin")} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-primary/30">
                <DropdownMenuItem onClick={() => onEdit(server.id)} className="font-mono text-sm cursor-pointer">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleActive(server.id)} className="font-mono text-sm cursor-pointer">
                  <Power className="w-4 h-4 mr-2" />
                  {server.is_active ? 'Disable' : 'Enable'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)} 
                  className="font-mono text-sm text-destructive cursor-pointer focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-primary">
              &gt; confirm deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-muted-foreground">
              Are you sure you want to delete "{server.nickname}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono border-primary/30">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(server.id)}
              className="font-mono bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}