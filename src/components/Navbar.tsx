import { Radio, Search, MapPin, History, BookOpen, ShieldCheck, Mail, Lock } from 'lucide-react';

interface NavbarProps {
  activeTab: 'lookup' | 'live' | 'history' | 'intelligence' | 'security';
  setActiveTab: (tab: 'lookup' | 'live' | 'history' | 'intelligence' | 'security') => void;
  historyCount: number;
  activeShareSessionCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  historyCount,
  activeShareSessionCount,
}: NavbarProps) {
  const ADMIN_EMAIL = 'wajhatbhai30@gmail.com';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('lookup')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">Phone<span className="text-cyan-400">Trace</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">PRO</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Phone Intelligence & Location Sharing</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'lookup'
                  ? 'bg-slate-800/90 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Number Lookup</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'live'
                  ? 'bg-slate-800/90 text-emerald-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Live Location Sharing</span>
              {activeShareSessionCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  {activeShareSessionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-slate-800/90 text-indigo-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'intelligence'
                  ? 'bg-slate-800/90 text-amber-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Telecom Intel</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'bg-slate-800/90 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Security & Admin</span>
            </button>
          </nav>

          {/* Right Header: Security & Verified Officer */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveTab('security')}
              className="cursor-pointer hidden lg:flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-xs"
              title={`Security Admin: ${ADMIN_EMAIL}`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Admin:</span>
              <span className="font-mono text-cyan-300 truncate max-w-[150px]">{ADMIN_EMAIL}</span>
            </div>

            <button
              onClick={() => setActiveTab('security')}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Contact Security Admin"
              aria-label="Contact Security"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('lookup')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'lookup' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span>Lookup</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'live' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" />
            <span>Live GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'history' ? 'text-indigo-400' : 'text-slate-400'
            }`}
          >
            <History className="w-4 h-4 mb-0.5" />
            <span>History</span>
          </button>

          <button
            onClick={() => setActiveTab('intelligence')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'intelligence' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Intel</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
              activeTab === 'security' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
