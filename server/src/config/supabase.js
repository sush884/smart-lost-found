import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';

// Admin client for backend operations (audit logs, token verifications, signed URLs)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.anonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Helper to create an authenticated client scoped to the caller's JWT
export const createScopedClient = (jwtToken) => {
  return createClient(config.supabase.url, config.supabase.anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
};
