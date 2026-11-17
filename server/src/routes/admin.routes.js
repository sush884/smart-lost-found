import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAnalytics, getAuditLogs } from '../controllers/admin.controller.js';

const router = Router();

router.get('/analytics', requireAuth, requireRole(['admin']), getAnalytics);
router.get('/audit-logs', requireAuth, requireRole(['admin']), getAuditLogs);

export default router;
