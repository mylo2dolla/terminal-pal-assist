import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Terminal, Loader2 } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('> Login successful');
        onOpenChange(false);
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast.success('> Account created successfully');
        onOpenChange(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      toast.error(`> Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="bg-card border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary font-mono">
            <Terminal className="w-5 h-5" />
            <span className="text-glow">{isLogin ? '> ssh login' : '> create_user'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-muted-foreground font-mono text-sm">
                display_name:
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="root"
                className="bg-input border-primary/30 text-foreground font-mono focus:border-primary focus:ring-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground font-mono text-sm">
              email:
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@server.local"
              required
              className="bg-input border-primary/30 text-foreground font-mono focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground font-mono text-sm">
              password:
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-input border-primary/30 text-foreground font-mono focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isLogin ? '> authenticate' : '> register'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); resetForm(); }}
            className="text-muted-foreground hover:text-primary font-mono text-sm transition-colors"
          >
            {isLogin ? '> new user? create account' : '> existing user? login'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};