import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appOrigin: process.env.APP_ORIGIN || 'http://localhost:5173',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  handoverTokenSecret: process.env.HANDOVER_TOKEN_SECRET || 'default-handover-secret-salt-2026',
  imageServiceUrl: process.env.IMAGE_SERVICE_URL || 'http://localhost:8000',
};

export const isProduction = config.nodeEnv === 'production';

export const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_URL !== 'https://placeholder-project.supabase.co' &&
  !process.env.SUPABASE_URL.includes('placeholder')
);
