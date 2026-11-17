import React from 'react';
import { MapPin, Shield, Layers, Navigation } from 'lucide-react';

export const CAMPUS_ZONES = [
  { id: '22222222-2222-2222-2222-222222222201', name: 'Central Library', code: 'LIB-01', x: 28, y: 35, color: 'bg-indigo-500' },
  { id: '22222222-2222-2222-2222-222222222202', name: 'Main Auditorium', code: 'AUD-01', x: 55, y: 22, color: 'bg-purple-500' },
  { id: '22222222-2222-2222-2222-222222222203', name: 'Engineering Block A', code: 'ENG-A', x: 18, y: 65, color: 'bg-blue-500' },
  { id: '22222222-2222-2222-2222-222222222204', name: 'Science Block B', code: 'SCI-B', x: 42, y: 70, color: 'bg-teal-500' },
  { id: '22222222-2222-2222-2222-222222222205', name: 'Student Activity Center', code: 'SAC-01', x: 75, y: 45, color: 'bg-amber-500' },
  { id: '22222222-2222-2222-2222-222222222206', name: 'Campus Cafeteria', code: 'CAF-01', x: 50, y: 48, color: 'bg-rose-500' },
  { id: '22222222-2222-2222-2222-222222222207', name: 'Sports Ground', code: 'SPT-01', x: 80, y: 75, color: 'bg-emerald-500' },
  { id: '22222222-2222-2222-2222-222222222208', name: 'North Gate Security (Custody Desk)', code: 'SEC-01', x: 50, y: 8, color: 'bg-slate-800' },
];

export default function CampusMap({ selectedLocationId, onSelectLocation }) {
  return (
    <div className="relative w-full aspect-[16/10] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl p-4 sm:p-6 text-white select-none">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Campus Map Header */}
      <div className="relative z-10 flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold tracking-tight">Interactive Campus Zone Map</h3>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Approximate Radar Zones (Safe Privacy Guard)
        </div>
      </div>

      {/* SVG Pathways */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <line x1="50%" y1="8%" x2="55%" y2="22%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="55%" y1="22%" x2="50%" y2="48%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="48%" x2="28%" y2="35%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="28%" y1="35%" x2="18%" y2="65%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="48%" x2="42%" y2="70%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="48%" x2="75%" y2="45%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="75%" y1="45%" x2="80%" y2="75%" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      {/* Markers */}
      <div className="relative w-full h-full">
        {CAMPUS_ZONES.map((zone) => {
          const isSelected = selectedLocationId === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelectLocation && onSelectLocation(zone.id === selectedLocationId ? null : zone.id)}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 ${
                isSelected ? 'scale-125 ring-4 ring-indigo-400' : 'hover:scale-110'
              }`}
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${zone.color} flex items-center justify-center text-white shadow-lg shadow-black/40 border border-white/20`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-[10px] sm:text-xs font-semibold whitespace-nowrap shadow-md group-hover:bg-indigo-600 transition-colors">
                  {zone.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
