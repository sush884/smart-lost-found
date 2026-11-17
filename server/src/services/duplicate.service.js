import { supabaseAdmin } from '../config/supabase.js';
import { calculateTextSimilarity } from './matching.service.js';

/**
 * Checks if a new report submission is a potential duplicate of an existing recent report
 */
export async function checkForDuplicates(userId, reportType, title, categoryId) {
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const { data: recentReports, error } = await supabaseAdmin
      .from('reports')
      .select('id, title, category_id, status, created_at, owner_id')
      .eq('report_type', reportType)
      .eq('category_id', categoryId)
      .gte('created_at', twoDaysAgo)
      .limit(20);

    if (error || !recentReports || recentReports.length === 0) {
      return { isDuplicate: false, candidates: [] };
    }

    const matches = [];

    for (const report of recentReports) {
      const similarity = calculateTextSimilarity(title, report.title);
      if (similarity >= 0.6) {
        matches.push({
          reportId: report.id,
          title: report.title,
          similarityScore: Number((similarity * 100).toFixed(1)),
          isSameUser: report.owner_id === userId,
          createdAt: report.created_at,
        });
      }
    }

    return {
      isDuplicate: matches.length > 0,
      candidates: matches,
    };
  } catch (err) {
    console.error('[DuplicateService] Error checking duplicate:', err);
    return { isDuplicate: false, candidates: [] };
  }
}
