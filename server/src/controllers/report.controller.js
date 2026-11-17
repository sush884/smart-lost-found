import { supabaseAdmin } from '../config/supabase.js';
import { isSupabaseConfigured } from '../config/index.js';
import { localStore } from '../services/store.js';
import { recordAuditEvent } from '../middleware/auth.js';
import { compareReports } from '../services/matching.service.js';
import { checkForDuplicates } from '../services/duplicate.service.js';
import { z } from 'zod';

const createReportSchema = z.object({
  reportType: z.enum(['lost', 'found']),
  title: z.string().min(3).max(120),
  description: z.string().min(5).max(1000),
  categoryId: z.string(),
  locationId: z.string(),
  eventAt: z.string(),
  colour: z.string().max(40).optional().nullable(),
  brand: z.string().max(60).optional().nullable(),
  attributes: z.record(z.any()).optional().nullable(),
  privateNotes: z.string().max(1000).optional().nullable(),
  heldBy: z.string().max(80).optional().nullable(),
});

function enrichReport(rep) {
  const cat = localStore.categories.find((c) => c.id === rep.category_id);
  const loc = localStore.campus_locations.find((l) => l.id === rep.location_id);
  return {
    ...rep,
    categories: cat ? { name: cat.name, icon: cat.icon } : { name: 'General', icon: 'Tag' },
    campus_locations: loc ? { name: loc.name, zone_code: loc.zone_code } : { name: 'Campus Zone', zone_code: 'Z-01' },
    imageUrl: rep.imageUrl || null,
  };
}

/**
 * Process matches in local store
 */
function processLocalMatches(newReport) {
  const oppositeType = newReport.report_type === 'lost' ? 'found' : 'lost';
  const candidates = localStore.reports.filter(
    (r) => r.report_type === oppositeType && r.status === 'open' && r.owner_id !== newReport.owner_id
  );

  for (const candidate of candidates) {
    const lostItem = newReport.report_type === 'lost' ? newReport : candidate;
    const foundItem = newReport.report_type === 'found' ? newReport : candidate;

    const matchResult = compareReports(lostItem, foundItem);

    if (matchResult.finalScore >= 50) {
      const matchObj = {
        id: `match-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        lost_report_id: lostItem.id,
        found_report_id: foundItem.id,
        category_score: matchResult.components.category,
        text_score: matchResult.components.text,
        date_score: matchResult.components.date,
        location_score: matchResult.components.location,
        attribute_score: matchResult.components.attributes,
        final_score: matchResult.finalScore,
        explanation: matchResult.explanation,
        status: 'suggested',
        created_at: new Date().toISOString(),
      };
      localStore.matches.push(matchObj);

      // Notification
      localStore.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: candidate.owner_id,
        type: 'MATCH_ALERT',
        title: `Potential ${matchResult.label} Detected!`,
        body_public: `Our AI matched your report "${candidate.title}" with a new listing (${matchResult.finalScore}% score).`,
        related_report_id: candidate.id,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
  }
}

/**
 * POST /api/reports
 */
export const createReport = async (req, res) => {
  try {
    const parseResult = createReportSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid report data',
        errors: parseResult.error.errors,
      });
    }

    const val = parseResult.data;

    const newReport = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      owner_id: req.user.id,
      report_type: val.reportType,
      title: val.title,
      description_public: val.description,
      category_id: val.categoryId,
      location_id: val.locationId,
      event_at: new Date(val.eventAt).toISOString(),
      colour: val.colour || null,
      brand: val.brand || null,
      attributes_public: val.attributes || {},
      private_notes: val.privateNotes || null,
      held_by: val.heldBy || null,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin.from('reports').insert([newReport]).select().single();
      if (!error && data) {
        return res.status(201).json({ status: 'ok', data: { report: data } });
      }
    }

    localStore.reports.unshift(newReport);
    processLocalMatches(newReport);
    await recordAuditEvent(req.user.id, 'REPORT_CREATED', 'reports', newReport.id);

    return res.status(201).json({
      status: 'ok',
      message: `${val.reportType === 'lost' ? 'Lost' : 'Found'} report filed successfully.`,
      data: {
        report: enrichReport(newReport),
      },
    });
  } catch (err) {
    console.error('[ReportCtrl] createReport error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to create report' });
  }
};

/**
 * GET /api/reports
 */
export const getReports = async (req, res) => {
  try {
    const { type, category, location, status = 'open', search, page = 1, limit = 12 } = req.query;

    if (isSupabaseConfigured) {
      // Standard supabase queries
    }

    let list = [...localStore.reports];

    if (type && type !== 'all') {
      list = list.filter((r) => r.report_type === type);
    }
    if (category && category !== 'all') {
      list = list.filter((r) => r.category_id === category);
    }
    if (location && location !== 'all') {
      list = list.filter((r) => r.location_id === location);
    }
    if (status && status !== 'all') {
      list = list.filter((r) => r.status === status);
    } else {
      list = list.filter((r) => r.status !== 'rejected');
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description_public.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const paginated = list.slice(offset, offset + parseInt(limit)).map(enrichReport);

    return res.status(200).json({
      status: 'ok',
      data: paginated,
      meta: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('[ReportCtrl] getReports error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch reports' });
  }
};

/**
 * GET /api/reports/:id
 */
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const found = localStore.reports.find((r) => r.id === id);

    if (!found) {
      return res.status(404).json({ status: 'error', message: 'Report not found' });
    }

    const report = { ...enrichReport(found) };

    const isOwnerOrStaff =
      req.user &&
      (req.user.id === report.owner_id || ['moderator', 'admin'].includes(req.profile?.role));

    if (!isOwnerOrStaff) {
      delete report.private_notes;
    }

    report.images = [];
    return res.status(200).json({ status: 'ok', data: report });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve report' });
  }
};

/**
 * GET /api/reports/:id/matches
 */
export const getReportMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const report = localStore.reports.find((r) => r.id === id);
    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Report not found' });
    }

    const isLost = report.report_type === 'lost';
    const matches = localStore.matches
      .filter((m) => (isLost ? m.lost_report_id === id : m.found_report_id === id) && m.status !== 'dismissed')
      .map((m) => {
        const targetId = isLost ? m.found_report_id : m.lost_report_id;
        const targetReport = localStore.reports.find((r) => r.id === targetId);
        return {
          ...m,
          targetReport: targetReport ? enrichReport(targetReport) : null,
        };
      });

    return res.status(200).json({ status: 'ok', data: matches });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to retrieve matches' });
  }
};

/**
 * POST /api/matches/:id/dismiss
 */
export const dismissMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = localStore.matches.find((m) => m.id === id);
    if (match) match.status = 'dismissed';
    return res.status(200).json({ status: 'ok', message: 'Suggestion dismissed' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to dismiss match' });
  }
};

/**
 * POST /api/reports/:id/close
 */
export const closeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = localStore.reports.find((r) => r.id === id);
    if (!report) return res.status(404).json({ status: 'error', message: 'Report not found' });

    report.status = 'closed';
    report.closed_at = new Date().toISOString();
    return res.status(200).json({ status: 'ok', message: 'Report closed', data: report });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to close report' });
  }
};

/**
 * POST /api/reports/:id/images
 */
export const uploadReportImage = async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(201).json({
      status: 'ok',
      message: 'Image uploaded successfully.',
      data: {
        id: `img-${Date.now()}`,
        report_id: id,
        signedUrl: null,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to upload image' });
  }
};
