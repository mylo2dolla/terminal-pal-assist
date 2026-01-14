import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type ServerConfiguration = Tables<'server_configurations'>;

interface ServerWithStatus extends ServerConfiguration {
  connectionStatus: 'online' | 'offline' | 'checking' | 'unknown';
  lastChecked?: Date;
  latency?: number;
}

export const useServers = () => {
  const { user } = useAuth();
  const [servers, setServers] = useState<ServerWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = useCallback(async () => {
    if (!user) {
      setServers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('server_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const serversWithStatus: ServerWithStatus[] = (data || []).map(server => ({
        ...server,
        connectionStatus: 'unknown' as const,
      }));

      setServers(serversWithStatus);
    } catch (error) {
      console.error('Error fetching servers:', error);
      toast.error('Failed to load servers');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    fetchServers();

    const channel = supabase
      .channel('server_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'server_configurations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchServers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchServers]);

  const checkServerStatus = async (serverId: string) => {
    setServers(prev => prev.map(s => 
      s.id === serverId ? { ...s, connectionStatus: 'checking' as const } : s
    ));

    const server = servers.find(s => s.id === serverId);
    if (!server?.api_endpoint) {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, connectionStatus: 'unknown' as const, lastChecked: new Date() } : s
      ));
      return;
    }

    const startTime = Date.now();

    try {
      const { error } = await supabase.functions.invoke('api-proxy', {
        body: {
          server_id: serverId,
          endpoint: '/health',
          method: 'GET',
        },
      });

      const latency = Date.now() - startTime;

      setServers(prev => prev.map(s => 
        s.id === serverId ? { 
          ...s, 
          connectionStatus: error ? 'offline' : 'online',
          lastChecked: new Date(),
          latency,
        } : s
      ));
    } catch {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, connectionStatus: 'offline' as const, lastChecked: new Date() } : s
      ));
    }
  };

  const checkAllServers = async () => {
    for (const server of servers) {
      await checkServerStatus(server.id);
    }
  };

  const addServer = async (serverData: {
    nickname: string;
    host: string;
    port?: number;
    username?: string;
    auth_type?: 'password' | 'key';
    api_endpoint?: string;
    description?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('server_configurations')
      .insert({
        user_id: user.id,
        nickname: serverData.nickname,
        host: serverData.host,
        port: serverData.port || 22,
        username: serverData.username,
        auth_type: serverData.auth_type || 'password',
        api_endpoint: serverData.api_endpoint,
        description: serverData.description,
      })
      .select()
      .single();

    if (error) throw error;
    toast.success(`> Server "${serverData.nickname}" added`);
    return data;
  };

  const updateServer = async (serverId: string, updates: Partial<ServerConfiguration>) => {
    const { error } = await supabase
      .from('server_configurations')
      .update(updates)
      .eq('id', serverId);

    if (error) throw error;
    toast.success('> Server updated');
  };

  const deleteServer = async (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    const { error } = await supabase
      .from('server_configurations')
      .delete()
      .eq('id', serverId);

    if (error) throw error;
    toast.success(`> Server "${server?.nickname}" removed`);
  };

  const toggleServerActive = async (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (!server) return;

    await updateServer(serverId, { is_active: !server.is_active });
  };

  return {
    servers,
    loading,
    fetchServers,
    checkServerStatus,
    checkAllServers,
    addServer,
    updateServer,
    deleteServer,
    toggleServerActive,
  };
};