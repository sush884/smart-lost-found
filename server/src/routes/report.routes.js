import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createReport,
  getReports,
  getReportById,
  getReportMatches,
  dismissMatch,
  closeReport,
  uploadReportImage,
} from '../controllers/report.controller.js';

const router = Router();

// Public / Authenticated browse
router.get('/', getReports);
router.get('/:id', getReportById);

// Protected report actions
router.post('/', requireAuth, createReport);
router.post('/:id/close', requireAuth, closeReport);
router.post('/:id/images', requireAuth, upload.single('image'), uploadReportImage);
router.get('/:id/matches', requireAuth, getReportMatches);
router.post('/matches/:id/dismiss', requireAuth, dismissMatch);

export default router;
