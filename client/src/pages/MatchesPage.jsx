import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReportService } from '../services/api';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  Cpu 
} from 'lucide-react';

export default function MatchesPage() {
  const { user } = useAuth();
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const repRes = await ReportService.getReports({ limit: 50 });
      const ownReports = (repRes.data || []).filter((r) => r.owner_id === user?.id);

      const matchPromises = ownReports.map((r) =>
        ReportService.getMatches(r.id)
          .then((res) => (res.data || []).map((m) => ({ ...m, sourceReport: r })))
          .catch(() => [])
      );

      const results = await Promise.all(matchPromises);
      const flattened = results.flat();
      setAllMatches(flattened);
    } catch (err) {
      console.error('Fetch matches error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMatches();
  }, [user]);

  const handleDismiss = async (matchId) => {
    try {
      await ReportService.dismissMatch(matchId);
      setAllMatches((prev) => prev.filter((m) => m.id !== matchId));
    } catch (err) {
      alert(err.message || 'Failed to dismiss match');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Heuristic Correlation Radar
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          AI Potential Matches & Explanations
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Formula: <code className="bg-slate-100 px-1 py-0.5 rounded">0.30*Category + 0.25*Text + 0.20*Date + 0.15*Location + 0.10*Attributes</code>. Human verification always required.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Scanning campus listings for correlations...</p>
        </div>
      ) : allMatches.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 border border-slate-200 space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">No Potential Matches</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When someone reports an item sharing category, textual clues, location zone, and date proximity with your belongings, it will appear here.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors mt-2"
          >
            Browse Public Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {allMatches.map((m) => {
            const isHigh = m.final_score >= 80;
            return (
              <div
                key={m.id}
                className="glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Header score banner */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold text-white shadow-md ${
                        isHigh
                          ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                          : 'bg-gradient-to-tr from-amber-500 to-orange-500'
                      }`}
                    >
                      <span className="text-lg leading-none">{Math.round(m.final_score)}%</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-90">Score</span>
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isHigh ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isHigh ? 'Strong Potential Match' : 'Possible Match'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        Correlation between your report and candidate turn-in
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismiss(m.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors self-end sm:self-center"
                    title="Dismiss suggestion"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Side-by-side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Your Report */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      YOUR REGISTERED REPORT
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{m.sourceReport?.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{m.sourceReport?.description_public}</p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Event: {new Date(m.sourceReport?.event_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Candidate Report */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 block">
                      CAMPUS RADAR CANDIDATE
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{m.targetReport?.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{m.targetReport?.description_public}</p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Event: {new Date(m.targetReport?.event_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Explainable Reasons */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Explainable Matching Criteria</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {(m.explanation || []).map((exp, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 italic">
                    Notice: Suggested matches never replace human ownership verification.
                  </span>
                  <div className="flex gap-2">
                    <Link
                      to={`/items/${m.targetReport?.id}`}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      View Listing & Submit Claim
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
