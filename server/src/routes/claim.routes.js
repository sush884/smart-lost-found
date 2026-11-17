import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import {
  submitClaim,
  getMyClaims,
  getModerationClaims,
  reviewClaim,
  generateHandoverToken,
  redeemHandoverToken,
  confirmManualHandover,
} from '../controllers/claim.controller.js';

const router = Router();

// Student / Claimant routes
router.post('/', requireAuth, submitClaim);
router.get('/mine', requireAuth, getMyClaims);

// Staff / Moderator review routes
router.get('/moderation/queue', requireAuth, requireRole(['moderator', 'admin']), getModerationClaims);
router.patch('/moderation/:id', requireAuth, requireRole(['moderator', 'admin']), reviewClaim);
router.post('/:id/handover-token', requireAuth, requireRole(['moderator', 'admin']), generateHandoverToken);

// Handover redemption & manual confirmation
router.post('/handover/redeem', requireAuth, requireRole(['moderator', 'admin']), redeemHandoverToken);
router.post('/handover/:claimId/confirm', requireAuth, requireRole(['moderator', 'admin']), confirmManualHandover);

export default router;
