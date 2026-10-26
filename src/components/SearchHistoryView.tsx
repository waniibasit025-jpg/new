import { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { PhoneLookupResult, SearchFilters } from '../types';
import { POPULAR_COUNTRIES } from '../utils/phoneLookup';

interface SearchHistoryViewProps {
  history: PhoneLookupResult[];
  onSelectQuery: (phone: string, country?: string) => void;
  onClearHistory: () => void;
  isHistoryPaused: boolean;
  onTogglePauseHistory: () => void;
}

export default function SearchHistoryView({
  history,
  onSelectQuery,
  onClearHistory,
  isHistoryPaused,
  onTogglePauseHistory,
}: SearchHistoryViewProps) {
  // Advanced Filter state for history
  const [historyFilters, setHistoryFilters] = useState<SearchFilters>({
    numberType: 'ALL',
    country: 'ALL',
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Apply filters
  const filteredHistory = history.filter((item) => {
    // Text search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesText =
        item.query.toLowerCase().includes(q) ||
        (item.e164 && item.e164.toLowerCase().includes(q)) ||
        (item.carrier && item.carrier.toLowerCase().includes(q)) ||
        (item.countryName && item.countryName.toLowerCase().includes(q));
      if (!matchesText) return false;
    }

    // Number type filter
    if (historyFilters.numberType !== 'ALL') {
      if (item.lineType !== historyFilters.numberType) {
        return false;
      }
    }

    // Country filter
    if (historyFilters.country !== 'ALL') {
      if (item.countryCode.toUpperCase() !== historyFilters.country.toUpperCase()) {
        return false;
      }
    }

    return true;
  });

  const exportHistory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `phonetrace_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Lookup History & Privacy Controls
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Locally stored searches on your device. Filter by number type and country, or wipe logs anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onTogglePauseHistory}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isHistoryPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {isHistoryPaused ? 'History: Paused' : 'History: Active'}
          </button>

          {history.length > 0 && (
            <>
              <button
                onClick={exportHistory}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onClearHistory}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by phone number, carrier, country..."
              className="w-full h-10 bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <div className="w-full sm:w-48">
            <select
              value={historyFilters.numberType}
              onChange={(e) => setHistoryFilters({ ...historyFilters, numberType: e.target.value as any })}
              className="w-full h-10 bg-slate-950 border border-slate-700 rounded-lg px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Number Types</option>
              <option value="MOBILE">Mobile Only</option>
              <option value="FIXED_LINE">Landline Only</option>
              <option value="VOIP">VoIP Only</option>
              <option value="TOLL_FREE">Toll-Free Only</option>
            </select>
          </div>

          {/* Country Filter */}
          <div className="w-full sm:w-48">
            <select
              value={historyFilters.country}
              onChange={(e) => setHistoryFilters({ ...historyFilters, country: e.target.value })}
              className="w-full h-10 bg-slate-950 border border-slate-700 rounded-lg px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Countries</option>
              {POPULAR_COUNTRIES.map((c) => (
                <option key={`hist_country_${c.code}`} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(historyFilters.numberType !== 'ALL' || historyFilters.country !== 'ALL' || searchTerm) && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Showing {filteredHistory.length} of {history.length} records matching filters</span>
            <button
              onClick={() => {
                setHistoryFilters({ numberType: 'ALL', country: 'ALL' });
                setSearchTerm('');
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Lookup Records Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {history.length === 0
              ? 'Your searches will appear here. Phone numbers are stored strictly on your local browser device for your convenience.'
              : 'No items match your active filters. Try adjusting the search term or dropdown selections.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {item.countryFlag}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      {item.e164 || item.query}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                      item.isValid
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {item.isValid ? item.lineTypeLabel : 'Invalid'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {item.carrier} • {item.region} • {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectQuery(item.e164 || item.query, item.countryCode)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Re-Analyze</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
