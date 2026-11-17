import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroScene from '../components/three/HeroScene';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Cpu, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-200/50 via-purple-100/30 to-teal-100/40 blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Campus Recovery Intelligence Platform 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Lost Something? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500">
                Let Intelligence Find It.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              A high-security, cloud-driven lost & found system for our campus. Automated semantic matching, private ownership evidence, and QR-verified handovers protect your belongings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5" />
                Report Lost or Found
              </Link>
              <Link
                to="/browse"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5 text-slate-500" />
                Browse Campus Items
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80">
              <div>
                <p className="text-2xl font-bold text-slate-900">89.4%</p>
                <p className="text-xs text-slate-500 font-medium">Recovery Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">&lt; 14 hrs</p>
                <p className="text-xs text-slate-500 font-medium">Avg. Match Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Private Clue Guard</p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual / 3D Canvas Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-lg rounded-3xl glass-card p-4 sm:p-6 shadow-2xl overflow-hidden border border-slate-200">
              {/* Floating badges */}
              <div className="flex justify-between items-start mb-2">
                <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-indigo-700 flex items-center gap-1.5 shadow-sm">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  NLP Match Engine Active
                </div>
                <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Realtime Cloud Sync
                </div>
              </div>

              {/* 3D Scene */}
              <HeroScene />

              {/* Sample Match Banner */}
              <div className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-indigo-200 uppercase font-semibold">Live Heuristic Match Engine</p>
                  <p className="text-xs font-bold">Black Laptop Sleeve — Central Library</p>
                </div>
                <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-lg">92% Match</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Workflow Features */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How Smart Recovery Works</h2>
            <p className="mt-3 text-base text-slate-500">
              A four-step closed loop ensuring zero false ownership handovers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Report Belongs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit public-safe descriptions, timestamps and campus zone. Private clues are kept strictly confidential.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Heuristic Match</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The engine evaluates category, text keywords, elapsed time, campus proximity and color to calculate a score.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Private Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Claimants provide unique private clues (lockscreen wallpaper, serial digit, pouch contents) to the campus moderator.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">QR Secure Handover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Moderator generates an expiring, one-time digital token for verified physical handover at security custody.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
