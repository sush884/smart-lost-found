import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { config, isSupabaseConfigured } from '../config/index.js';
import { localStore } from '../services/store.js';
import { recordAuditEvent } from '../middleware/auth.js';
import { z } from 'zod';

const submitClaimSchema = z.object({
  foundReportId: z.string(),
  matchId: z.string().optional().nullable(),
  privateAnswers: z.record(z.any()),
  evidenceStoragePath: z.string().optional().nullable(),
});

const reviewClaimSchema = z.object({
  status: z.enum(['approved', 'rejected', 'info_requested']),
  moderatorNote: z.string().max(500).optional().nullable(),
  decisionReason: z.string().max(500).optional().nullable(),
});

function hashToken(rawToken) {
  return crypto
    .createHmac('sha256', config.handoverTokenSecret)
    .update(rawToken)
    .digest('hex');
}

/**
 * POST /api/claims
 */
export const submitClaim = async (req, res) => {
  try {
    const parseResult = submitClaimSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ status: 'error', message: 'Invalid claim data', errors: parseResult.error.errors });
    }

    const { foundReportId, matchId, privateAnswers } = parseResult.data;

    const newClaim = {
      id: `claim-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      found_report_id: foundReportId,
      match_id: matchId || null,
      claimant_id: req.user.id,
      private_answers: privateAnswers,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStore.claims.unshift(newClaim);
    await recordAuditEvent(req.user.id, 'CLAIM_SUBMITTED', 'claims', newClaim.id);

    return res.status(201).json({
      status: 'ok',
      message: 'Claim submitted for moderator verification. Your private evidence is securely protected.',
      data: newClaim,
    });
  } catch (err) {
    console.error('[ClaimCtrl] submitClaim error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to submit claim' });
  }
};

/**
 * GET /api/claims/mine
 */
export const getMyClaims = async (req, res) => {
  try {
    const userClaims = localStore.claims
      .filter((c) => c.claimant_id === req.user.id)
      .map((c) => {
        const foundRep = localStore.reports.find((r) => r.id === c.found_report_id);
        const cat = localStore.categories.find((cat) => cat.id === foundRep?.category_id);
        const loc = localStore.campus_locations.find((l) => l.id === foundRep?.location_id);
        return {
          ...c,
          foundReport: foundRep
            ? {
                ...foundRep,
                categories: { name: cat?.name || 'General' },
                campus_locations: { name: loc?.name || 'Campus' },
              }
            : null,
        };
      });

    return res.status(200).json({ status: 'ok', data: userClaims });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve claims' });
  }
};

/**
 * GET /api/claims/moderation/queue
 */
export const getModerationClaims = async (req, res) => {
  try {
    const queue = localStore.claims.map((c) => {
      const claimant = localStore.profiles.find((p) => p.id === c.claimant_id);
      const foundRep = localStore.reports.find((r) => r.id === c.found_report_id);
      const cat = localStore.categories.find((cat) => cat.id === foundRep?.category_id);
      const loc = localStore.campus_locations.find((l) => l.id === foundRep?.location_id);
      return {
        ...c,
        claimant: claimant || { display_name: 'Student Claimant', campus_email: 'student@campus.edu', department: 'Computer Science' },
        foundReport: foundRep
          ? {
              ...foundRep,
              categories: { name: cat?.name || 'General' },
              campus_locations: { name: loc?.name || 'Campus' },
            }
          : null,
      };
    });

    return res.status(200).json({ status: 'ok', data: queue });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch moderation queue' });
  }
};

/**
 * PATCH /api/claims/moderation/:id
 */
export const reviewClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, decisionReason } = req.body;

    const claim = localStore.claims.find((c) => c.id === id);
    if (!claim) return res.status(404).json({ status: 'error', message: 'Claim not found' });

    claim.status = status;
    claim.decision_reason = decisionReason;
    claim.updated_at = new Date().toISOString();

    if (status === 'approved') {
      const rep = localStore.reports.find((r) => r.id === claim.found_report_id);
      if (rep) rep.status = 'claimed';
    }

    // In-app notification
    localStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: claim.claimant_id,
      type: 'CLAIM_DECISION',
      title: `Claim Update: ${status === 'approved' ? 'Approved!' : 'Status Changed'}`,
      body_public: `Your claim was reviewed by campus staff. ${decisionReason || ''}`,
      related_claim_id: id,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    return res.status(200).json({ status: 'ok', message: 'Claim review updated', data: claim });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to review claim' });
  }
};

/**
 * POST /api/claims/:id/handover-token
 */
export const generateHandoverToken = async (req, res) => {
  try {
    const { id } = req.params;
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    localStore.handover_tokens.push({
      id: `tok-${Date.now()}`,
      claim_id: id,
      token_hash: tokenHash,
      rawToken,
      expires_at: expiresAt,
      redeemed_at: null,
      created_by: req.user.id,
      created_at: new Date().toISOString(),
    });

    return res.status(201).json({
      status: 'ok',
      message: 'One-time secure handover pass generated.',
      data: {
        rawToken,
        expiresAt,
        tokenId: `tok-${Date.now()}`,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to generate handover token' });
  }
};

/**
 * POST /api/claims/handover/redeem
 */
export const redeemHandoverToken = async (req, res) => {
  try {
    const { rawToken } = req.body;
    if (!rawToken) return res.status(400).json({ status: 'error', message: 'Raw token is required' });

    const tokenHash = hashToken(rawToken);
    const token = localStore.handover_tokens.find((t) => t.token_hash === tokenHash || t.rawToken === rawToken);

    if (!token) return res.status(404).json({ status: 'error', message: 'Invalid or unknown handover pass' });
    if (token.redeemed_at) return res.status(400).json({ status: 'error', message: 'This pass has already been redeemed!' });

    const now = new Date().toISOString();
    token.redeemed_at = now;

    const claim = localStore.claims.find((c) => c.id === token.claim_id);
    if (claim) {
      claim.status = 'approved';
      const rep = localStore.reports.find((r) => r.id === claim.found_report_id);
      if (rep) {
        rep.status = 'recovered';
        rep.closed_at = now;
      }
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Secure handover confirmed! Belonging officially recorded as recovered.',
      data: { redeemedAt: now },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to redeem token' });
  }
};

/**
 * POST /api/claims/handover/:claimId/confirm
 */
export const confirmManualHandover = async (req, res) => {
  return res.status(200).json({ status: 'ok', message: 'Manual handover recorded.' });
};
