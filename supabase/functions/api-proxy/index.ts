import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProxyRequest {
  server_id?: string;
  endpoint?: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const requestBody: ProxyRequest = await req.json();
    const { server_id, endpoint, method = 'GET', body, headers: customHeaders } = requestBody;

    // If server_id is provided, look up the server's API endpoint
    let targetUrl = endpoint;
    
    if (server_id) {
      const { data: server, error: serverError } = await supabase
        .from('server_configurations')
        .select('api_endpoint, host, port')
        .eq('id', server_id)
        .eq('user_id', user.id)
        .single();

      if (serverError || !server) {
        return new Response(
          JSON.stringify({ error: 'Server not found or access denied' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Use api_endpoint if set, otherwise construct from host:port
      targetUrl = server.api_endpoint || `http://${server.host}:${server.port}`;
      if (endpoint) {
        targetUrl = `${targetUrl}${endpoint}`;
      }
    }

    if (!targetUrl) {
      return new Response(
        JSON.stringify({ error: 'No target URL provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the command to history
    await supabase.from('connection_history').insert({
      user_id: user.id,
      server_id: server_id || null,
      command: `${method} ${targetUrl}`,
      status: 'pending',
    });

    // Make the proxied request
    const proxyResponse = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseData = await proxyResponse.text();
    
    // Update history with response
    await supabase.from('connection_history').insert({
      user_id: user.id,
      server_id: server_id || null,
      command: `${method} ${targetUrl}`,
      response: responseData.substring(0, 10000), // Limit response size
      status: proxyResponse.ok ? 'success' : 'error',
    });

    return new Response(responseData, {
      status: proxyResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': proxyResponse.headers.get('Content-Type') || 'application/json',
      },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});