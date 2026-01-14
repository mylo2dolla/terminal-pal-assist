import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Server, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddServerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (server: {
    nickname: string;
    host: string;
    port?: number;
    username?: string;
    auth_type?: 'password' | 'key';
    api_endpoint?: string;
    description?: string;
  }) => Promise<unknown>;
}

export const AddServerModal = ({ open, onOpenChange, onAdd }: AddServerModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    host: '',
    port: '22',
    username: '',
    auth_type: 'password' as 'password' | 'key',
    api_endpoint: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAdd({
        nickname: formData.nickname,
        host: formData.host,
        port: parseInt(formData.port) || 22,
        username: formData.username || undefined,
        auth_type: formData.auth_type,
        api_endpoint: formData.api_endpoint || undefined,
        description: formData.description || undefined,
      });
      
      resetForm();
      onOpenChange(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add server';
      toast.error(`> Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nickname: '',
      host: '',
      port: '22',
      username: '',
      auth_type: 'password',
      api_endpoint: '',
      description: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { onOpenChange(open); if (!open) resetForm(); }}>
      <DialogContent className="bg-card border-primary/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary font-mono">
            <Server className="w-5 h-5" />
            <span className="text-glow">&gt; add_server</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-muted-foreground font-mono text-sm">
                nickname: <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="raspberry-pi"
                required
                className="bg-input border-primary/30 text-foreground font-mono focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-muted-foreground font-mono text-sm">
                username:
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="pi"
                className="bg-input border-primary/30 text-foreground font-mono focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="host" className="text-muted-foreground font-mono text-sm">
                host: <span className="text-destructive">*</span>
              </Label>
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                placeholder="192.168.1.100"
                required
                className="bg-input border-primary/30 text-foreground font-mono focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port" className="text-muted-foreground font-mono text-sm">
                port:
              </Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                placeholder="22"
                className="bg-input border-primary/30 text-foreground font-mono focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth_type" className="text-muted-foreground font-mono text-sm">
              auth_type:
            </Label>
            <Select 
              value={formData.auth_type} 
              onValueChange={(value: 'password' | 'key') => setFormData(prev => ({ ...prev, auth_type: value }))}
            >
              <SelectTrigger className="bg-input border-primary/30 text-foreground font-mono focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-primary/30">
                <SelectItem value="password" className="font-mono">password</SelectItem>
                <SelectItem value="key" className="font-mono">ssh_key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_endpoint" className="text-muted-foreground font-mono text-sm">
              api_endpoint: <span className="text-muted-foreground/60">(for status checks)</span>
            </Label>
            <Input
              id="api_endpoint"
              value={formData.api_endpoint}
              onChange={(e) => setFormData(prev => ({ ...prev, api_endpoint: e.target.value }))}
              placeholder="http://192.168.1.100:3000"
              className="bg-input border-primary/30 text-foreground font-mono focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-muted-foreground font-mono text-sm">
              description:
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Home server running Docker containers..."
              rows={2}
              className="bg-input border-primary/30 text-foreground font-mono focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-mono border-primary/30"
            >
              cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              &gt; add_server
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};