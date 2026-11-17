import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationService } from '../services/api';
import { Bell, CheckCircle2, Sparkles, ShieldCheck, Clock, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await NotificationService.getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Radar Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding potential matches, evidence requests, and recovery passes.
          </p>
        </div>

        {notifications.some((n) => !n.is_read) && (
          <button
            onClick={handleMarkAll}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500">Loading alerts...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 border border-slate-200 space-y-2">
          <Bell className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">You're All Caught Up</h3>
          <p className="text-xs text-slate-400">No active alerts or match notices at this moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isMatch = n.type === 'MATCH_ALERT';
            return (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  n.is_read
                    ? 'border-slate-200/80 bg-white/70'
                    : 'border-indigo-200 bg-indigo-50/40 shadow-xs'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white ${
                    isMatch ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                >
                  {isMatch ? <Sparkles className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.body_public}</p>

                  {n.related_report_id && (
                    <Link
                      to={`/items/${n.related_report_id}`}
                      className="inline-block text-[11px] font-bold text-indigo-600 hover:underline pt-1"
                    >
                      Inspect Report →
                    </Link>
                  )}
                  {n.related_claim_id && (
                    <Link
                      to="/claims"
                      className="inline-block text-[11px] font-bold text-indigo-600 hover:underline pt-1"
                    >
                      View Claim & Digital Pass →
                    </Link>
                  )}
                </div>

                {!n.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-2"></span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
