import { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Share2,
  ExternalLink,
  Shield,
  Clock,
  Radio,
  MapPin,
  Filter,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { PhoneLookupResult, SearchFilters, CountryOption } from '../types';
import { POPULAR_COUNTRIES } from '../utils/phoneLookup';
import LeafletMap from './LeafletMap';

interface PhoneLookupViewProps {
  onLookupComplete: (result: PhoneLookupResult) => void;
  onRequestLiveSharing: (phoneNumber: string) => void;
  initialQuery?: string;
}

export default function PhoneLookupView({
  onLookupComplete,
  onRequestLiveSharing,
  initialQuery = '',
}: PhoneLookupViewProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(POPULAR_COUNTRIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PhoneLookupResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Advanced Search Filters state
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    numberType: 'ALL',
    country: 'ALL',
  });

  // Sample quick test numbers
  const SAMPLE_NUMBERS = [
    { label: 'US Mobile', num: '+1 (415) 555-2671', country: 'US', type: 'Mobile' },
    { label: 'India Mobile', num: '+91 98765 43210', country: 'IN', type: 'Mobile' },
    { label: 'UK Mobile', num: '+44 7911 123456', country: 'GB', type: 'Mobile' },
    { label: 'US NYC Landline', num: '+1 (212) 555-0199', country: 'US', type: 'Fixed-Line' },
    { label: 'Germany Cellular', num: '+49 151 23456789', country: 'DE', type: 'Mobile' },
    { label: 'Japan Cellular', num: '+81 90-1234-5678', country: 'JP', type: 'Mobile' },
  ];

  const handleLookup = async (overrideNumber?: string) => {
    const target = overrideNumber !== undefined ? overrideNumber : phoneNumber;
    if (!target.trim()) {
      setErrorMsg('Please enter a phone number to analyze.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: target,
          defaultCountry: selectedCountry.code,
          filters,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to complete phone lookup');
      }

      const data: PhoneLookupResult = await res.json();
      setResult(data);
      onLookupComplete(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during lookup.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const applySample = (sample: typeof SAMPLE_NUMBERS[0]) => {
    setPhoneNumber(sample.num);
    const country = POPULAR_COUNTRIES.find(c => c.code === sample.country);
    if (country) setSelectedCountry(country);
    handleLookup(sample.num);
  };

  const resetFilters = () => {
    setFilters({
      numberType: 'ALL',
      country: 'ALL',
    });
  };

  const activeFilterCount = (filters.numberType !== 'ALL' ? 1 : 0) + (filters.country !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>ITU-T Standard Telecom Intelligence & Region Mapping</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Discover Phone Number <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Details</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
          Check phone number information, explore available registered region details, and request live location sharing with explicit recipient permission.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="space-y-4">
          {/* Input Row */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Country Selector */}
            <div className="w-full md:w-64 flex-shrink-0">
              <label htmlFor="country-selector" className="block text-xs font-medium text-slate-400 mb-1.5">
                Country Code
              </label>
              <div className="relative">
                <select
                  id="country-selector"
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = POPULAR_COUNTRIES.find(c => c.code === e.target.value);
                    if (found) setSelectedCountry(found);
                  }}
                  className="w-full h-12 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none cursor-pointer"
                >
                  {POPULAR_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-slate-100 py-1">
                      {c.flag} {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="text-xs">▼</span>
                </div>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="flex-1">
              <label htmlFor="phone-input" className="block text-xs font-medium text-slate-400 mb-1.5">
                Phone Number (e.g. {selectedCountry.dialCode} {selectedCountry.formatPlaceholder})
              </label>
              <div className="relative flex items-center">
                <input
                  id="phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                  placeholder={`Enter phone number (e.g. ${selectedCountry.dialCode} ${selectedCountry.formatPlaceholder})`}
                  className="w-full h-12 bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 text-base text-slate-100 placeholder:text-slate-500 font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                {phoneNumber && (
                  <button
                    onClick={() => setPhoneNumber('')}
                    className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white"
                    aria-label="Clear input"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Lookup Button */}
            <div className="flex items-end">
              <button
                id="lookup-button"
                onClick={() => handleLookup()}
                disabled={isLoading}
                className="w-full md:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-slate-950" />
                    <span>Lookup Number</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ADVANCED SEARCH FILTERS (Main Feature on Search Page) */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Advanced Search Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {activeFilterCount} Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {/* Filter 1: Line / Number Type */}
                <div>
                  <label htmlFor="filter-number-type" className="block text-[11px] font-medium text-slate-400 mb-1">
                    Filter by Number Type
                  </label>
                  <select
                    id="filter-number-type"
                    value={filters.numberType}
                    onChange={(e) => setFilters({ ...filters, numberType: e.target.value as any })}
                    className="w-full h-9 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="ALL">All Number Types (Any)</option>
                    <option value="MOBILE">Mobile / Cellular Only</option>
                    <option value="FIXED_LINE">Landline / Fixed-Line Only</option>
                    <option value="VOIP">VoIP / Virtual PBX Only</option>
                    <option value="TOLL_FREE">Toll-Free Numbers Only</option>
                    <option value="PREMIUM_RATE">Premium Rate Only</option>
                  </select>
                </div>

                {/* Filter 2: Specific Country Filter */}
                <div>
                  <label htmlFor="filter-country" className="block text-[11px] font-medium text-slate-400 mb-1">
                    Filter by Country Match
                  </label>
                  <select
                    id="filter-country"
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full h-9 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="ALL">All Countries (No Country Filter)</option>
                    {POPULAR_COUNTRIES.map((c) => (
                      <option key={`filter_${c.code}`} value={c.code}>
                        {c.flag} {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Status / Helper */}
                <div className="flex flex-col justify-end text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>
                      {filters.numberType === 'ALL' && filters.country === 'ALL'
                        ? 'Broad search: Accepts any valid international subscriber.'
                        : `Targeting: ${filters.numberType !== 'ALL' ? filters.numberType : 'Any Type'} in ${filters.country !== 'ALL' ? filters.country : 'Any Country'}.`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sample Numbers */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Demo Samples:</span>
            {SAMPLE_NUMBERS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => applySample(s)}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* LOOKUP RESULTS SECTION */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Summary Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {result.countryFlag}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white font-mono">{result.international || result.query}</h2>
                    {result.isValid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid Format
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
                        <XCircle className="w-3.5 h-3.5" /> Invalid / Unassigned
                      </span>
                    )}

                    {/* Filter Match Badge */}
                    {result.filterMatches !== undefined && (
                      result.filterMatches ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Filter Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Filter Mismatch
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {result.countryName} ({result.callingCode}) • {result.lineTypeLabel} • {result.region}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onRequestLiveSharing(result.e164 || result.query)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-950" />
                  <span>Request Live GPS with Consent</span>
                </button>

                <a
                  href={`https://wa.me/${(result.e164 || '').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700 transition"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'json')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700 transition"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedField === 'json' ? 'Copied!' : 'Copy Intel'}</span>
                </button>
              </div>
            </div>

            {/* Filter mismatch explanation banner if applicable */}
            {result.filterMismatchReason && (
              <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Filter Notice:</strong> {result.filterMismatchReason}
                </span>
              </div>
            )}
          </div>

          {/* Intelligence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Carrier & Operator */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Network Carrier</span>
                <Radio className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-base font-bold text-slate-100">{result.carrier}</div>
              <p className="text-[11px] text-slate-400">
                Operating telecommunication carrier determined from prefix allocation & telecom circles.
              </p>
            </div>

            {/* Card 2: Line Type */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Line Type</span>
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              </div>
              <div className="text-base font-bold text-slate-100">{result.lineTypeLabel}</div>
              <p className="text-[11px] text-slate-400">
                Type: <span className="font-mono text-cyan-300">{result.lineType}</span> (SIM Mobile vs Fixed Wireline)
              </p>
            </div>

            {/* Card 3: Timezone & Clock */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Local Timezone</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-base font-bold text-slate-100">
                {result.timezones[0] || 'UTC'}
              </div>
              <p className="text-[11px] text-slate-400">
                Current Time: <span className="text-slate-200 font-medium">{result.currentTime}</span>
              </p>
            </div>

            {/* Card 4: Risk & Fraud Check */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider">Risk Assessment</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  result.riskScore === 'Low'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : result.riskScore === 'Medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {result.riskScore} Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {result.riskReason}
              </p>
            </div>
          </div>

          {/* Interactive Map & Telecom Geography */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Column (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Interactive Telecom Region Map
                  </h3>
                  <p className="text-xs text-slate-400">
                    OpenStreetMap displaying the registered geographical circle for this phone prefix.
                  </p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Leaflet + OpenStreetMap
                </span>
              </div>

              <LeafletMap
                mode="telecom"
                telecomLocation={result.location}
                title={`Telecom Allocation: ${result.location.regionName}`}
                height="440px"
              />

              {/* Crucial Legal & Technical Transparency Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">How This Location Works: </span>
                  {result.disclaimer} To see where someone actually is in real-time, use our{' '}
                  <button
                    onClick={() => onRequestLiveSharing(result.e164 || result.query)}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Live Location Sharing
                  </button>{' '}
                  feature which sends an encrypted consent link.
                </div>
              </div>
            </div>

            {/* Specifications Column (1 col) */}
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Number Format Specifications
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="text-slate-400 mb-0.5">E.164 International Format</div>
                    <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-cyan-300">
                      <span>{result.e164 || 'N/A'}</span>
                      <button
                        onClick={() => copyToClipboard(result.e164, 'e164')}
                        className="text-slate-400 hover:text-white"
                        aria-label="Copy E.164 format"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-0.5">National Format</div>
                    <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-slate-200">
                      <span>{result.national || 'N/A'}</span>
                      <button
                        onClick={() => copyToClipboard(result.national, 'national')}
                        className="text-slate-400 hover:text-white"
                        aria-label="Copy national format"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 mb-0.5">RFC 3966 URI</div>
                    <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-slate-300 text-[11px] truncate">
                      <span className="truncate">{result.rfc3966}</span>
                      <button
                        onClick={() => copyToClipboard(result.rfc3966, 'rfc')}
                        className="text-slate-400 hover:text-white flex-shrink-0 ml-1"
                        aria-label="Copy RFC URI"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Details Card */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registered Geographic Details
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Country</span>
                    <span className="font-semibold text-white">{result.countryName} ({result.countryCode})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Registered Circle</span>
                    <span className="font-semibold text-white">{result.location.regionName}</span>
                  </div>
                  {result.location.cityName && (
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Metro / City</span>
                      <span className="font-semibold text-white">{result.location.cityName}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Coordinates</span>
                    <span className="font-mono text-cyan-300">{result.location.lat.toFixed(4)}, {result.location.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Circle Radius</span>
                    <span className="font-medium text-slate-300">~{result.location.accuracyKm} km</span>
                  </div>
                </div>
              </div>

              {/* Next Step: Start Live Location Request */}
              <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 rounded-xl border border-emerald-800/50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Need Real-Time GPS Tracking?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate a secure one-time link to send to this person. Once they click and grant browser location access, their live coordinates will stream to your screen.
                </p>
                <button
                  onClick={() => onRequestLiveSharing(result.e164 || result.query)}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Create Live Location Sharing Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
