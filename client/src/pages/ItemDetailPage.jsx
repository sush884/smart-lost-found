import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReportService, ClaimService } from '../services/api';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Send,
  XCircle
} from 'lucide-react';

export default function ItemDetailPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimAnswer1, setClaimAnswer1] = useState('');
  const [claimAnswer2, setClaimAnswer2] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    async function loadItem() {
      try {
        const repRes = await ReportService.getReportById(id);
        setReport(repRes.data);

        // If user is authenticated, check for matches
        if (user) {
          const matchRes = await ReportService.getMatches(id).catch(() => ({ data: [] }));
          setMatches(matchRes.data || []);
        }
      } catch (err) {
        setError(err.message || 'Report not found or private');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id, user]);

  const handleCloseReport = async () => {
    if (!confirm('Are you sure you want to close this report?')) return;
    try {
      await ReportService.closeReport(id);
      setReport((prev) => ({ ...prev, status: 'closed' }));
    } catch (err) {
      alert(err.message || 'Failed to close report');
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimSubmitting(true);
    try {
      await ClaimService.submitClaim({
        foundReportId: id,
        privateAnswers: {
          identifyingMarks: claimAnswer1,
          compartmentContentsOrWallpaper: claimAnswer2,
        },
      });
      setClaimSuccess(true);
      setTimeout(() => {
        setClaimModalOpen(false);
        navigate('/claims');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit claim');
    } finally {
      setClaimSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Report Not Available</h2>
        <p className="text-xs text-slate-500">{error || 'This report may have been archived or removed.'}</p>
        <Link to="/browse" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
          Return to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === report.owner_id;
  const isStaff = ['moderator', 'admin'].includes(profile?.role);
  const isLost = report.report_type === 'lost';
  const primaryImg = report.images?.[0]?.signedUrl;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/browse" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        Back to Campus Radar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl border border-slate-200 overflow-hidden">
            {/* Image Preview */}
            <div className="w-full aspect-[16/10] bg-slate-900 relative flex items-center justify-center overflow-hidden">
              {primaryImg ? (
                <img src={primaryImg} alt={report.title} className="w-full h-full object-contain" />
              ) : (
                <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Tag className="w-10 h-10 text-slate-500" />
                  <span>No Photograph Provided by Reporter</span>
                </div>
              )}

              <span
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md ${
                  isLost ? 'bg-rose-500 text-white' : 'bg-teal-600 text-white'
                }`}
              >
                {isLost ? 'Lost Item Report' : 'Found Item Record'}
              </span>

              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                Status: {report.status.toUpperCase()}
              </span>
            </div>

            {/* Description & Attributes */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {report.categories?.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {report.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Report ID: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">{report.id}</code>
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public Safe Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {report.description_public}
                </p>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">COLOR</span>
                  <span className="font-bold text-slate-800">{report.colour || 'Unspecified'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">BRAND</span>
                  <span className="font-bold text-slate-800">{report.brand || 'Unspecified'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">LOCATION ZONE</span>
                  <span className="font-bold text-slate-800">{report.campus_locations?.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">DATE & TIME</span>
                  <span className="font-bold text-slate-800">{new Date(report.event_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Confidential Notes (Visible ONLY to Owner or Staff) */}
              {(isOwner || isStaff) && report.private_notes && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Confidential Verification Notes (Visible only to you & staff)</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-mono">
                    {report.private_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Heuristic Matches */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recovery Actions</h3>

            {!isLost && !isOwner && report.status === 'open' && (
              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Submit Ownership Claim
              </button>
            )}

            {(isOwner || isStaff) && report.status === 'open' && (
              <button
                onClick={handleCloseReport}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Close / Archive Report
              </button>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 block">Campus Custody Desk:</span>
              <p>Items in custody are held at North Gate Security. Handover requires moderator digital pass approval.</p>
            </div>
          </div>

          {/* AI Matches List */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Potential Matches ({matches.length})</span>
              </div>
              <span className="text-[10px] text-slate-400">NLP & Heuristics</span>
            </div>

            {matches.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No active opposite-type matches detected yet. Radar continues scanning.
              </p>
            ) : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        {m.final_score}% Match
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-700">{m.targetReport?.categories?.name}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{m.targetReport?.title}</h4>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      {m.explanation?.slice(0, 2).map((exp, i) => (
                        <p key={i} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{exp}</span>
                        </p>
                      ))}
                    </div>

                    <Link
                      to={`/items/${m.targetReport?.id}`}
                      className="inline-block text-[11px] font-bold text-indigo-600 hover:underline pt-1"
                    >
                      Compare Details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Private Ownership Claim Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md glass-card rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                Private Verification
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Submit Ownership Proof</h3>
              <p className="text-xs text-slate-500">
                Provide private identifying clues known only to the genuine owner. This is strictly confidential.
              </p>
            </div>

            {claimSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Claim submitted successfully! Redirecting to claims hub...</span>
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Unique identifying marks, scratches, or stickers
                </label>
                <textarea
                  required
                  rows={2}
                  value={claimAnswer1}
                  onChange={(e) => setClaimAnswer1(e.target.value)}
                  placeholder="e.g. A small white scratch on the bottom right corner; yellow sticker inside."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Lock screen wallpaper, contents of pockets, or partial serial number
                </label>
                <textarea
                  required
                  rows={2}
                  value={claimAnswer2}
                  onChange={(e) => setClaimAnswer2(e.target.value)}
                  placeholder="e.g. Has photo of golden retriever dog as wallpaper; keychain contains bike key 412."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claimSubmitting || claimSuccess}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {claimSubmitting ? 'Submitting...' : 'Submit Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
