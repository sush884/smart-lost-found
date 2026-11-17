import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReportService, ClaimService } from '../services/api';
import AiAssistantModal from '../components/common/AiAssistantModal';
import { 
  PlusCircle, 
  Search, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Award,
  Bot,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [repRes, claimRes] = await Promise.all([
          ReportService.getReports({ limit: 50 }).catch(() => ({ data: [] })),
          ClaimService.getMyClaims().catch(() => ({ data: [] })),
        ]);

        // Filter user's own reports
        const own = (repRes.data || []).filter((r) => r.owner_id === user?.id);
        setMyReports(own);
        setMyClaims(claimRes.data || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) loadDashboard();
  }, [user]);

  const activeReportsCount = myReports.filter((r) => r.status === 'open').length;
  const recoveredCount = myReports.filter((r) => r.status === 'recovered').length;
  // Reward points calculation (50 points per recovered found turn-in)
  const rewardPoints = myReports.filter((r) => r.report_type === 'found' && r.status === 'recovered').length * 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-white/10 px-3 py-0.5 rounded-full backdrop-blur-xs">
              Campus Recovery Intelligence Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {profile?.display_name || user?.email?.split('@')[0]}!
          </h1>

          <p className="text-sm text-indigo-100 leading-relaxed">
            Role: <span className="font-semibold text-white uppercase">{profile?.role || 'student'}</span> | 
            Department: <span className="text-white">{profile?.department || 'General'}</span> | 
            Campus Email: <span className="text-white">{profile?.campus_email || user?.email}</span>
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-semibold text-xs hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              Report Lost or Found Item
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/60 text-white border border-indigo-400/30 font-semibold text-xs hover:bg-indigo-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Browse Campus Belongings
            </Link>
            <button
              onClick={() => setAiAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600/60 text-white border border-purple-400/30 font-semibold text-xs hover:bg-purple-600 transition-colors"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              AI Assistant
            </button>
          </div>
        </div>

        {/* Decorative blur circle */}
        <div className="absolute -right-12 -bottom-12 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>MY ACTIVE REPORTS</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{activeReportsCount}</p>
          <p className="text-xs text-slate-400 mt-1">Open reports on radar</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>MY CLAIMS</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{myClaims.length}</p>
          <p className="text-xs text-slate-400 mt-1">Under verification / passes</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>RECOVERED BELONGINGS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{recoveredCount}</p>
          <p className="text-xs text-slate-400 mt-1">Safely handed over</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>COMMUNITY KARMA</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-purple-600 mt-2">{rewardPoints} pts</p>
          <p className="text-xs text-slate-400 mt-1">Good Samaritan recognition</p>
        </div>
      </div>

      {/* My Reports List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">My Registered Campus Reports</h2>
          <Link to="/report" className="text-xs font-semibold text-indigo-600 hover:underline">
            + File New Report
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading your reports...</div>
        ) : myReports.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-slate-400 border border-slate-200 space-y-2">
            <Layers className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No reports recorded yet</p>
            <p className="text-xs text-slate-400">
              When you submit a lost notice or found item, manage its lifecycle and matches here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myReports.map((rep) => {
              const isLost = rep.report_type === 'lost';
              return (
                <Link
                  key={rep.id}
                  to={`/items/${rep.id}`}
                  className="glass-card p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isLost ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {isLost ? 'Lost Report' : 'Found Report'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {rep.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {rep.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{rep.description_public}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                    <span>{new Date(rep.event_at).toLocaleDateString()}</span>
                    <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating AI Assistant Trigger */}
      <button
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 flex items-center gap-2 text-xs font-semibold hover:scale-105 transition-all z-40"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">Recovery Assistant</span>
      </button>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
}
