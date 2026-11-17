import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Sparkles, Shield, User, Award } from 'lucide-react';

export default function LoginPage() {
  const { login, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('student@campus.edu');
  const [password, setPassword] = useState('StudentPass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Persona Login
  const handleInstantPersona = async (role) => {
    let targetEmail = 'student@campus.edu';
    let targetPass = 'StudentPass123!';

    if (role === 'moderator') {
      targetEmail = 'moderator@campus.edu';
      targetPass = 'ModeratorPass123!';
    } else if (role === 'admin') {
      targetEmail = 'admin@campus.edu';
      targetPass = 'AdminPass123!';
    }

    setEmail(targetEmail);
    setPassword(targetPass);
    setError('');
    setLoading(true);

    try {
      await login(targetEmail, targetPass);
      if (role === 'moderator') {
        navigate('/moderation');
      } else if (role === 'admin') {
        navigate('/admin/analytics');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate persona');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 glass-card p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to Campus Portal</h2>
          <p className="mt-1 text-xs text-slate-500">Access your lost & found reports, potential matches, and claims</p>
        </div>

        {/* Quick One-Click Demo Personas */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 border border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Instant One-Click Login
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Click any persona to log in and inspect the role interface immediately:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleInstantPersona('student')}
              className="py-2 px-2 text-xs bg-white hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-400 rounded-xl text-indigo-900 font-bold transition-all shadow-2xs flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>Student</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleInstantPersona('moderator')}
              className="py-2 px-2 text-xs bg-white hover:bg-amber-50 border border-amber-200 hover:border-amber-400 rounded-xl text-amber-900 font-bold transition-all shadow-2xs flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Moderator</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleInstantPersona('admin')}
              className="py-2 px-2 text-xs bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-xl text-purple-900 font-bold transition-all shadow-2xs flex flex-col items-center gap-1"
            >
              <Award className="w-4 h-4 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rollno@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
