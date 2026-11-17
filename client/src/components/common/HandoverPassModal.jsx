import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HandoverPassModal({ isOpen, onClose, passData, itemName }) {
  if (!isOpen || !passData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm glass-card rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-6 text-center space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-700">
            <QrCode className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Digital Recovery Pass</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Approved by Campus Staff
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-2">{itemName || 'Verified Belonging'}</h3>
          <p className="text-xs text-slate-500">
            Present this QR pass to the duty officer at North Gate Security custody desk.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-indigo-200 shadow-xs inline-block mx-auto">
          <QRCodeSVG
            value={passData.rawToken || 'dummy-token'}
            size={180}
            bgColor="#ffffff"
            fgColor="#1e1b4b"
            level="H"
            includeMargin={true}
          />
        </div>

        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center justify-center gap-1.5 text-amber-700 font-semibold text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires: {new Date(passData.expiresAt).toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Single-use cryptographic token. Automatically invalidated upon redemption.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Close Pass
        </button>
      </div>
    </div>
  );
}
