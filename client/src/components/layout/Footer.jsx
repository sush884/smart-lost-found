import React from 'react';
import { ShieldCheck, Cloud, Cpu, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900">Smart Lost & Found</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              An intelligent, privacy-preserving campus recovery system powered by cloud computing and machine learning.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Cloud Architecture</h4>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5 text-indigo-500" /> Supabase DBaaS & Auth</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Row-Level Security & Encrypted Storage</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-500" /> Scalable REST API & Realtime</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Campus Protocol</h4>
            <ul className="text-xs text-slate-500 space-y-2">
              <li>North Gate Security Custody</li>
              <li>Moderator-Verified Handover</li>
              <li>Expiring One-Time QR Pass</li>
              <li>Zero Public Clue Exposure</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Notice & Ethics</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Match percentages represent heuristic similarity scores, never automated ownership verification. Final claims always require human review.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 Smart Lost & Found Intelligence Platform. Cloud Computing Project.</p>
          <div className="flex gap-4">
            <span>Privacy Preserved</span>
            <span>•</span>
            <span>Enterprise Security</span>
            <span>•</span>
            <span>Real-Time Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
