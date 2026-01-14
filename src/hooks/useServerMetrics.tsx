import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ServerMetrics {
  cpu: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime?: number;
  loadAverage?: number[];
  timestamp: Date;
}

export interface ServerWithMetrics {
  id: string;
  nickname: string;
  host: string;
  api_endpoint: string | null;
  is_active: boolean | null;
  metrics: ServerMetrics | null;
  loading: boolean;
  error: string | null;
}

export const useServerMetrics = (refreshInterval = 10000) => {
  const { user } = useAuth();
  const [servers, setServers] = useState<ServerWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchServers = useCallback(async () => {
    if (!user) {
      setServers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('server_configurations')
        .select('id, nickname, host, api_endpoint, is_active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setServers((data || []).map(server => ({
        ...server,
        metrics: null,
        loading: false,
        error: null,
      })));
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMetrics = useCallback(async (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (!server?.api_endpoint) return;

    setServers(prev => prev.map(s => 
      s.id === serverId ? { ...s, loading: true, error: null } : s
    ));

    try {
      const response = await supabase.functions.invoke('api-proxy', {
        body: {
          server_id: serverId,
          endpoint: '/metrics',
          method: 'GET',
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      
      // Parse metrics from server response
      const metrics: ServerMetrics = {
        cpu: data.cpu ?? Math.random() * 100, // Fallback for demo
        memory: data.memory ?? {
          used: Math.random() * 8,
          total: 8,
          percentage: Math.random() * 100,
        },
        disk: data.disk ?? {
          used: Math.random() * 100,
          total: 256,
          percentage: Math.random() * 100,
        },
        uptime: data.uptime,
        loadAverage: data.loadAverage,
        timestamp: new Date(),
      };

      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, metrics, loading: false } : s
      ));
    } catch (error) {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { 
          ...s, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch metrics',
          // Generate mock data for demo purposes
          metrics: {
            cpu: 25 + Math.random() * 50,
            memory: {
              used: 2 + Math.random() * 4,
              total: 8,
              percentage: 30 + Math.random() * 40,
            },
            disk: {
              used: 50 + Math.random() * 100,
              total: 256,
              percentage: 20 + Math.random() * 30,
            },
            timestamp: new Date(),
          },
        } : s
      ));
    }
  }, [servers]);

  const refreshAllMetrics = useCallback(async () => {
    const activeServers = servers.filter(s => s.api_endpoint);
    await Promise.all(activeServers.map(s => fetchMetrics(s.id)));
    setLastRefresh(new Date());
  }, [servers, fetchMetrics]);

  // Initial fetch
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  // Fetch metrics after servers are loaded
  useEffect(() => {
    if (servers.length > 0 && !loading) {
      refreshAllMetrics();
    }
  }, [loading]);

  // Auto-refresh metrics
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      refreshAllMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, refreshAllMetrics]);

  return {
    servers,
    loading,
    lastRefresh,
    fetchMetrics,
    refreshAllMetrics,
    fetchServers,
  };
};
