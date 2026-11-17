import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReportService, CategoryService } from '../services/api';
import CampusMap from '../components/campus/CampusMap';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Map,
  ArrowRight
} from 'lucide-react';

export default function BrowsePage() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [status, setStatus] = useState('open');
  const [search, setSearch] = useState('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, locsRes] = await Promise.all([
          CategoryService.getCategories().catch(() => ({ data: [] })),
          CategoryService.getLocations().catch(() => ({ data: [] })),
        ]);
        setCategories(catsRes.data || []);
        setLocations(locsRes.data || []);
      } catch (err) {
        console.error('Meta load error:', err);
      }
    }
    loadMeta();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await ReportService.getReports({
        type: type !== 'all' ? type : undefined,
        category: category !== 'all' ? category : undefined,
        location: location !== 'all' ? location : undefined,
        status: status !== 'all' ? status : undefined,
        search: search.trim() || undefined,
      });
      setReports(res.data || []);
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [type, category, location, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Item Radar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse public-safe lost notices and turn-ins recorded in campus security custody.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            showMap
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Map className="w-4 h-4" />
          {showMap ? 'Hide Campus Map' : 'View Campus Map Radar'}
        </button>
      </div>

      {/* Interactive Campus Map View (Toggleable) */}
      {showMap && (
        <div className="animate-fadeIn">
          <CampusMap
            selectedLocationId={location !== 'all' ? location : null}
            onSelectLocation={(locId) => setLocation(locId || 'all')}
          />
        </div>
      )}

      {/* Search & Filters FilterBar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword (e.g. Dell XPS, Casio watch, gym bottle, key ring)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          {/* Type Filter */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Types (Lost & Found)</option>
            <option value="lost">Lost Belongings</option>
            <option value="found">Found Belongings</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Campus Zones</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white ml-auto"
          >
            <option value="open">Active / Open Only</option>
            <option value="claimed">Claim in Review</option>
            <option value="recovered">Successfully Recovered</option>
            <option value="all">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-medium">Scanning campus database...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center text-slate-400 border border-slate-200 space-y-3">
          <Search className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No Belongings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing selected filters, or file a report for this item.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors mt-2"
          >
            File New Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {reports.map((item) => {
            const isLost = item.report_type === 'lost';
            return (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col"
              >
                {/* Photo Thumbnail */}
                <div className="w-full aspect-[4/3] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-slate-300 text-xs flex flex-col items-center gap-1">
                      <Tag className="w-8 h-8 text-slate-300" />
                      <span>No Photo Attached</span>
                    </div>
                  )}

                  {/* Type badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                      isLost
                        ? 'bg-rose-500 text-white'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    {isLost ? 'Lost Item' : 'Found Item'}
                  </span>

                  {/* Status badge */}
                  {item.status === 'recovered' && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Recovered
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.categories?.name || 'General'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description_public}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.campus_locations?.name || 'Campus Grounds'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{new Date(item.event_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
