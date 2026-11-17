import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getMyProfile, updateMyProfile } from '../controllers/user.controller.js';

const router = Router();

// Current user profile endpoints
router.get('/', requireAuth, getMyProfile);
router.patch('/', requireAuth, updateMyProfile);

// Example test endpoint for role validation
router.get('/moderator-only', requireAuth, requireRole(['moderator', 'admin']), (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Authorized access to privileged moderation endpoint.',
    actor: req.profile.display_name,
    role: req.profile.role,
  });
});

export default router;
