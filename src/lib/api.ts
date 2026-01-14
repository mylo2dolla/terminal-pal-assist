import { supabase } from '@/integrations/supabase/client';

interface ProxyOptions {
  serverId?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

export const apiProxy = async (options: ProxyOptions) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('api-proxy', {
    body: {
      server_id: options.serverId,
      endpoint: options.endpoint,
      method: options.method || 'GET',
      body: options.body,
      headers: options.headers,
    },
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

// Server configuration helpers
export const getServers = async () => {
  const { data, error } = await supabase
    .from('server_configurations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addServer = async (server: {
  nickname: string;
  host: string;
  port?: number;
  username?: string;
  authType?: 'password' | 'key';
  apiEndpoint?: string;
  description?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('server_configurations')
    .insert({
      user_id: user.id,
      nickname: server.nickname,
      host: server.host,
      port: server.port || 22,
      username: server.username,
      auth_type: server.authType || 'password',
      api_endpoint: server.apiEndpoint,
      description: server.description,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteServer = async (serverId: string) => {
  const { error } = await supabase
    .from('server_configurations')
    .delete()
    .eq('id', serverId);

  if (error) throw error;
};

// Connection history helpers
export const getConnectionHistory = async (limit = 50) => {
  const { data, error } = await supabase
    .from('connection_history')
    .select('*, server_configurations(nickname)')
    .order('executed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

// User preferences helpers
export const getUserPreferences = async () => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateUserPreferences = async (preferences: {
  commandAliases?: Record<string, string>;
  favoriteCommands?: string[];
  notificationSettings?: { email: boolean; desktop: boolean };
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      command_aliases: preferences.commandAliases,
      favorite_commands: preferences.favoriteCommands,
      notification_settings: preferences.notificationSettings,
    })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};