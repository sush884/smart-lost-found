import { supabaseAdmin } from '../config/supabase.js';
import { recordAuditEvent } from '../middleware/auth.js';
import { z } from 'zod';

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(60).optional(),
  department: z.string().max(80).nullable().optional(),
});

/**
 * GET /api/me
 * Returns current authenticated profile
 */
export const getMyProfile = async (req, res) => {
  try {
    return res.status(200).json({
      status: 'ok',
      data: {
        profile: req.profile,
        user: {
          id: req.user.id,
          email: req.user.email,
          createdAt: req.user.created_at,
        },
      },
    });
  } catch (err) {
    console.error('[UserCtrl] getMyProfile error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve profile.',
    });
  }
};

/**
 * PATCH /api/me
 * Updates allowed profile fields (displayName, department)
 * Crucial Security Rule: Role, ID, and Email CANNOT be escalated by user.
 */
export const updateMyProfile = async (req, res) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid input data',
        errors: parseResult.error.errors,
      });
    }

    const { displayName, department } = parseResult.data;
    const updates = {};
    if (displayName !== undefined) updates.display_name = displayName;
    if (department !== undefined) updates.department = department;
    updates.updated_at = new Date().toISOString();

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Database update failed.',
      });
    }

    // Record audit event
    await recordAuditEvent(req.user.id, 'PROFILE_UPDATED', 'profiles', req.user.id, {
      updatedFields: Object.keys(updates),
    });

    return res.status(200).json({
      status: 'ok',
      message: 'Profile updated successfully.',
      data: {
        profile: updatedProfile,
      },
    });
  } catch (err) {
    console.error('[UserCtrl] updateMyProfile error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update profile.',
    });
  }
};
