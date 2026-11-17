import React, { useState, useEffect } from 'react';
import { ClaimService } from '../services/api';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  QrCode, 
  User, 
  Building, 
  Tag, 
  FileText,
  Clock,
  Scan,
  Check
} from 'lucide-react';

export default function ModerationPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Token redemption scanner state
  const [rawTokenInput, setRawTokenInput] = useState('');
  const [redeemResult, setRedeemResult] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  // Review modal state
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [reviewAction, setReviewAction] = useState('approved');
  const [decisionReason, setDecisionReason] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await ClaimService.getModerationQueue({
        status: filter !== 'all' ? filter : undefined,
      });
      setClaims(res.data || []);
    } catch (err) {
      console.error('Moderation queue error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filter]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;
    setReviewing(true);
    try {
      await ClaimService.reviewClaim(selectedClaim.id, {
        status: reviewAction,
        decisionReason,
      });
      setSelectedClaim(null);
      setDecisionReason('');
      fetchQueue();
    } catch (err) {
      alert(err.message || 'Failed to review claim');
    } finally {
      setReviewing(false);
    }
  };

  const handleRedeemToken = async (e) => {
    e.preventDefault();
    if (!rawTokenInput.trim()) return;
    setRedeeming(true);
    setRedeemResult(null);

    try {
      const res = await ClaimService.redeemHandoverToken(rawTokenInput.trim());
      setRedeemResult({
        success: true,
        message: res.message || 'Handover verified and marked as recovered!',
      });
      setRawTokenInput('');
      fetchQueue();
    } catch (err) {
      setRedeemResult({
        success: false,
        message: err.message || 'Token verification failed.',
      });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Staff & Security Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Moderator Review & Handover Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify private ownership evidence and authenticate QR handover passes at the custody desk.
          </p>
        </div>

        {/* Filter Tab */}
        <div className="flex gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
          >
            All Claims
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'pending' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'}`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'approved' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'}`}
          >
            Approved / Pass Issued
          </button>
        </div>
      </div>

      {/* Custody Desk QR Pass Redemption Bar */}
      <div className="glass-card p-6 rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Custody Desk QR Pass Redemption</h3>
        </div>
        <p className="text-xs text-slate-500">
          When a student presents their digital recovery QR code at North Gate Security, enter or scan the one-time token below to authenticate and close the record.
        </p>

        <form onSubmit={handleRedeemToken} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            required
            value={rawTokenInput}
            onChange={(e) => setRawTokenInput(e.target.value)}
            placeholder="Paste or scan 48-char raw handover token..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            disabled={redeeming}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {redeeming ? 'Verifying Hash...' : 'Authenticate Handover'}
          </button>
        </form>

        {redeemResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              redeemResult.success
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-rose-100 text-rose-900 border border-rose-300'
            }`}
          >
            {redeemResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 text-rose-700" />
            )}
            <span>{redeemResult.message}</span>
          </div>
        )}
      </div>

      {/* Review Queue Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading moderation records...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 border border-slate-200 space-y-2">
          <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500" />
          <h3 className="text-base font-bold text-slate-800">Queue is Clear</h3>
          <p className="text-xs text-slate-400">All submitted claims have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {claims.map((claim) => (
            <div key={claim.id} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Item: {claim.foundReport?.title}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Claim ID: <code className="bg-slate-100 px-1 py-0.5 rounded">{claim.id}</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      claim.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : claim.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>

              {/* Claimant Information & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Claimant Identity */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    Claimant Profile (Verified Session)
                  </span>
                  <p className="font-semibold text-slate-900">{claim.claimant?.display_name || 'Student'}</p>
                  <p className="text-slate-500">{claim.claimant?.campus_email}</p>
                  <p className="text-slate-500">Dept: {claim.claimant?.department || 'Unspecified'}</p>
                </div>

                {/* Private Answers */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs">
                  <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px] block">
                    Submitted Private Clues (Confidential)
                  </span>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700">Identifying Marks:</p>
                    <p className="italic text-slate-600 bg-white p-2 rounded-xl border border-indigo-100">
                      "{claim.private_answers?.identifyingMarks || 'None provided'}"
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700">Wallpaper / Compartment contents:</p>
                    <p className="italic text-slate-600 bg-white p-2 rounded-xl border border-indigo-100">
                      "{claim.private_answers?.compartmentContentsOrWallpaper || 'None provided'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedClaim(claim);
                    setReviewAction('approved');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Claim & Issue Pass
                </button>
                <button
                  onClick={() => {
                    setSelectedClaim(claim);
                    setReviewAction('rejected');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Claim
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Confirmation Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md glass-card rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Confirm Decision: {reviewAction === 'approved' ? 'Approve Claim' : 'Reject Claim'}
            </h3>
            <p className="text-xs text-slate-500">
              Item: <strong>{selectedClaim.foundReport?.title}</strong> for claimant{' '}
              <strong>{selectedClaim.claimant?.display_name}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moderator Note / Explanation sent to Claimant:
              </label>
              <textarea
                rows={3}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="e.g. Evidence matches custody description. You may proceed to North Gate Security for physical collection."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedClaim(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={reviewing}
                className={`flex-1 py-2 rounded-xl text-white text-xs font-semibold transition-colors ${
                  reviewAction === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {reviewing ? 'Recording Decision...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
