import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClaimService } from '../services/api';
import HandoverPassModal from '../components/common/HandoverPassModal';
import { 
  ShieldCheck, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText,
  ArrowRight
} from 'lucide-react';

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Digital pass modal state
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [passData, setPassData] = useState(null);
  const [selectedClaimTitle, setSelectedClaimTitle] = useState('');

  useEffect(() => {
    async function loadClaims() {
      try {
        const res = await ClaimService.getMyClaims();
        setClaims(res.data || []);
      } catch (err) {
        console.error('Failed to load claims:', err);
      } finally {
        setLoading(false);
      }
    }
    loadClaims();
  }, []);

  const handleOpenPass = async (claim) => {
    try {
      const res = await ClaimService.generateHandoverToken(claim.id);
      setPassData(res.data);
      setSelectedClaimTitle(claim.foundReport?.title);
      setPassModalOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to generate handover pass');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved by Staff</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Under Review</span>;
      case 'info_requested':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">More Info Needed</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Claim Rejected</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
          Ownership Verification Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          My Ownership Claims
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track confidential claim evaluations and retrieve expiring QR passes for physical item handovers.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading claims history...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 border border-slate-200 space-y-3">
          <ShieldCheck className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No Claims Filed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            If you identify your belonging among found items or match suggestions, submit a private claim to initiate recovery.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors mt-2"
          >
            Explore Found Belongings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((c) => (
            <div key={c.id} className="glass-card p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusBadge(c.status)}
                  <span className="text-xs text-slate-400">
                    Filed on {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Claim on: {c.foundReport?.title || 'Campus Item'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Location: {c.foundReport?.campus_locations?.name} | Category: {c.foundReport?.categories?.name}
                  </p>
                </div>

                {/* Evidence Summary (Safe view) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 text-[11px] block">Submitted Evidence Clues:</span>
                  <p className="text-[11px] italic">
                    "{c.private_answers?.identifyingMarks || 'Provided in submission'}"
                  </p>
                </div>

                {/* Moderator Decision notes if any */}
                {c.decision_reason && (
                  <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
                    <span className="font-semibold text-[11px] block">Campus Staff Note:</span>
                    <p className="text-[11px]">{c.decision_reason}</p>
                  </div>
                )}
              </div>

              {/* Action column */}
              <div className="sm:border-l sm:border-slate-100 sm:pl-6 flex flex-col justify-center items-start sm:items-end gap-2 shrink-0">
                {c.status === 'approved' ? (
                  <button
                    onClick={() => handleOpenPass(c)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    View Recovery Pass
                  </button>
                ) : c.status === 'pending' ? (
                  <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Awaiting Staff Review</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Review Concluded</span>
                )}

                <Link
                  to={`/items/${c.found_report_id}`}
                  className="text-xs font-semibold text-indigo-600 hover:underline pt-2 flex items-center gap-1"
                >
                  View Original Listing <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Handover Modal */}
      <HandoverPassModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        passData={passData}
        itemName={selectedClaimTitle}
      />
    </div>
  );
}
