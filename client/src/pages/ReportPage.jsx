import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryService, ReportService } from '../services/api';
import { 
  PlusCircle, 
  Upload, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Lock,
  Eye,
  Camera
} from 'lucide-react';

export default function ReportPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [reportType, setReportType] = useState('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [eventAt, setEventAt] = useState(new Date().toISOString().slice(0, 16));
  const [colour, setColour] = useState('');
  const [brand, setBrand] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, locsRes] = await Promise.all([
          CategoryService.getCategories().catch(() => ({ data: [] })),
          CategoryService.getLocations().catch(() => ({ data: [] })),
        ]);
        setCategories(catsRes.data || []);
        setLocations(locsRes.data || []);
        if (catsRes.data?.length > 0) setCategoryId(catsRes.data[0].id);
        if (locsRes.data?.length > 0) setLocationId(locsRes.data[0].id);
      } catch (err) {
        console.error('Failed to load categories/locations:', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadData();
  }, []);

  // AI Feature: Auto-detect category & color from title
  const handleTitleChange = (val) => {
    setTitle(val);
    const lower = val.toLowerCase();

    // Auto-colour suggestion
    const colours = ['black', 'blue', 'red', 'silver', 'white', 'grey', 'green', 'yellow', 'brown'];
    const matchedColour = colours.find((c) => lower.includes(c));
    if (matchedColour && !colour) {
      setColour(matchedColour.charAt(0).toUpperCase() + matchedColour.slice(1));
    }

    // Auto-category suggestion
    if (lower.includes('laptop') || lower.includes('phone') || lower.includes('earbud') || lower.includes('charger') || lower.includes('headphone')) {
      const elecCat = categories.find((c) => c.name.toLowerCase().includes('electronic'));
      if (elecCat) setCategoryId(elecCat.id);
    } else if (lower.includes('key') || lower.includes('id') || lower.includes('card')) {
      const keyCat = categories.find((c) => c.name.toLowerCase().includes('key'));
      if (keyCat) setCategoryId(keyCat.id);
    } else if (lower.includes('bag') || lower.includes('backpack') || lower.includes('sleeve')) {
      const bagCat = categories.find((c) => c.name.toLowerCase().includes('bag'));
      if (bagCat) setCategoryId(bagCat.id);
    } else if (lower.includes('wallet') || lower.includes('purse')) {
      const walCat = categories.find((c) => c.name.toLowerCase().includes('wallet'));
      if (walCat) setCategoryId(walCat.id);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5 MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDuplicateWarning(null);
    setSubmitting(true);

    try {
      const reportRes = await ReportService.createReport({
        reportType,
        title,
        description,
        categoryId,
        locationId,
        eventAt: new Date(eventAt).toISOString(),
        colour: colour || null,
        brand: brand || null,
        privateNotes: privateNotes || null,
      });

      const createdReport = reportRes.data.report;

      if (reportRes.data.duplicateWarning) {
        setDuplicateWarning(reportRes.data.duplicateWarning);
      }

      // If an image was selected, upload to private bucket
      if (imageFile && createdReport?.id) {
        await ReportService.uploadImage(createdReport.id, imageFile).catch((imgErr) => {
          console.warn('Image upload note:', imgErr.message);
        });
      }

      // Navigate to item detail
      navigate(`/items/${createdReport.id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Campus Verification Protocol
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Report Campus Belonging
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Submit verified details to engage our real-time matching radar across all campus zones.
        </p>
      </div>

      {/* Report Type Toggle */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-200/60 rounded-2xl">
        <button
          type="button"
          onClick={() => setReportType('lost')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            reportType === 'lost'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Misplaced Something (Lost Report)
        </button>
        <button
          type="button"
          onClick={() => setReportType('found')}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
            reportType === 'found'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Located Belonging (Found Report)
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {duplicateWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Duplicate Alert: Similar recent submissions detected</span>
          </div>
          <p className="text-[11px]">
            We identified existing reports that might match your item. You can view them before proceeding.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5">
        {/* Title */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">Item Title</label>
            <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-category suggestion active
            </span>
          </div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Black Dell XPS Laptop Sleeve, Silver Keychain with Blue Tag"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Zone / Location</label>
            <select
              required
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.zone_code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Approx. Date & Time</label>
            <input
              type="datetime-local"
              required
              value={eventAt}
              onChange={(e) => setEventAt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Color</label>
            <input
              type="text"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. Black, Blue"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Brand / Manufacturer</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Dell, Sony, Wildcraft"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
            />
          </div>
        </div>

        {/* Public-Safe Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Public Description (Visible to all students)</span>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe visible aspects (approx size, general condition, exterior wear). Never write personal phone numbers or unique secret clues here."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
          />
        </div>

        {/* Private Clues / Verification Notes */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
          <label className="block text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Private Ownership Clues (Strictly Confidential)</span>
          </label>
          <p className="text-[11px] text-slate-500">
            Visible only to you and authorized campus moderators. Use this for lock screen wallpaper, inner compartment items, or partial serial digits.
          </p>
          <textarea
            rows={2}
            value={privateNotes}
            onChange={(e) => setPrivateNotes(e.target.value)}
            placeholder="e.g. Has an anime lockscreen wallpaper; contains a green flash drive in the side zipper pocket."
            className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Cloud Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-indigo-600" />
            <span>Item Photograph (Stored in Private Encrypted Cloud Bucket)</span>
          </label>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Choose Photo (Max 5MB)</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
            </label>

            {imagePreview && (
              <div className="flex items-center gap-2">
                <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {submitting ? 'Submitting to Cloud Database...' : 'Register Report with Intelligence Radar'}
        </button>
      </form>
    </div>
  );
}
