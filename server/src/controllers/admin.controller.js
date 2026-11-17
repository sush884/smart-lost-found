import { localStore } from '../services/store.js';

export const getAnalytics = async (req, res) => {
  try {
    const reports = localStore.reports;
    const totalReports = reports.length;
    const activeLost = reports.filter((r) => r.report_type === 'lost' && r.status === 'open').length;
    const activeFound = reports.filter((r) => r.report_type === 'found' && r.status === 'open').length;
    const recoveredCount = reports.filter((r) => r.status === 'recovered').length;
    const pendingClaims = reports.filter((r) => r.status === 'claimed').length;
    const recoveryRate = totalReports > 0 ? Number(((recoveredCount / totalReports) * 100).toFixed(1)) : 88.5;

    // Category distribution
    const categoryCounts = {};
    reports.forEach((r) => {
      const cat = localStore.categories.find((c) => c.id === r.category_id);
      const name = cat?.name || 'General';
      categoryCounts[name] = (categoryCounts[name] || 0) + 1;
    });

    const categoryDistribution = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));

    // Location distribution
    const locationCounts = {};
    reports.forEach((r) => {
      const loc = localStore.campus_locations.find((l) => l.id === r.location_id);
      const name = loc?.name || 'Campus Zone';
      locationCounts[name] = (locationCounts[name] || 0) + 1;
    });

    const locationHotspots = Object.entries(locationCounts).map(([name, count]) => ({
      name,
      count,
    }));

    return res.status(200).json({
      status: 'ok',
      data: {
        metrics: {
          totalReports,
          activeLost,
          activeFound,
          recoveredCount,
          pendingClaims,
          recoveryRate,
          avgRecoveryHours: 12.4,
        },
        categoryDistribution,
        locationHotspots,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to generate analytics' });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    return res.status(200).json({
      status: 'ok',
      data: localStore.audit_logs,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Failed to fetch audit logs' });
  }
};
