import { Router } from 'express';
import { config } from '../config/index.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    system: 'Smart Lost & Found Intelligence System API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    cloudServices: {
      database: 'Supabase PostgreSQL',
      auth: 'Supabase Auth',
      storage: 'Supabase Private Storage (item-images)',
      realtime: 'Supabase Realtime',
      imageService: config.imageServiceUrl,
    },
  });
});

export default router;
