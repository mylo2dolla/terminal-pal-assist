import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, User, LogOut, Settings, Server, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary text-glow" />
            <span className="font-mono font-bold text-lg text-primary text-glow">ServerCMD</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={cn(
                "font-mono text-sm transition-colors",
                isActive('/') ? "text-primary text-glow" : "text-muted-foreground hover:text-primary"
              )}
            >
              home
            </Link>
            <Link 
              to="/servers" 
              className={cn(
                "font-mono text-sm transition-colors",
                isActive('/servers') ? "text-primary text-glow" : "text-muted-foreground hover:text-primary"
              )}
            >
              servers
            </Link>
            <Link 
              to="/metrics" 
              className={cn(
                "font-mono text-sm transition-colors",
                isActive('/metrics') ? "text-primary text-glow" : "text-muted-foreground hover:text-primary"
              )}
            >
              metrics
            </Link>
            <a href="#docs" className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors">
              docs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-primary/30">
                  <div className="px-3 py-2 border-b border-primary/20">
                    <p className="font-mono text-xs text-muted-foreground">logged in as</p>
                    <p className="font-mono text-sm text-primary truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="font-mono text-sm cursor-pointer">
                    <Link to="/servers">
                      <Server className="w-4 h-4 mr-2" />
                      My Servers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="font-mono text-sm cursor-pointer">
                    <Link to="/metrics">
                      <Gauge className="w-4 h-4 mr-2" />
                      Live Metrics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-mono text-sm cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="font-mono text-sm text-destructive cursor-pointer focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setAuthModalOpen(true)}
                variant="outline"
                className="font-mono text-sm border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};