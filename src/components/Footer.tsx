import { Radio, ShieldCheck, Mail, Lock } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onSelectTab: (tab: 'lookup' | 'live' | 'history' | 'intelligence' | 'security') => void;
}

export default function Footer({ onOpenPrivacy, onOpenTerms, onSelectTab }: FooterProps) {
  const ADMIN_EMAIL = 'wajhatbhai30@gmail.com';

  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-600 text-white">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">Phone<span className="text-cyan-400">Trace</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Phone intelligence, carrier resolution, registered region mapping, and secure consent-enforced live location sharing.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ITU-T & W3C Geolocation Standard</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-bold text-slate-200 text-xs uppercase tracking-wider">Features</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onSelectTab('lookup')} className="hover:text-cyan-400 transition">
                  Number Lookup & Filters
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('live')} className="hover:text-cyan-400 transition">
                  Live Location Sharing Link
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('history')} className="hover:text-cyan-400 transition">
                  Search History & Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('intelligence')} className="hover:text-cyan-400 transition">
                  Telecom Intel & SS7 Truth
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2">
            <div className="font-bold text-slate-200 text-xs uppercase tracking-wider">Compliance</div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-cyan-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-cyan-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('intelligence')} className="hover:text-cyan-400 transition">
                  Anti-Scam Transparency
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('security')} className="hover:text-cyan-400 transition">
                  Security Gateway Health
                </button>
              </li>
            </ul>
          </div>

          {/* Administration & Contact */}
          <div className="space-y-2">
            <div className="font-bold text-slate-200 text-xs uppercase tracking-wider">Security & Admin</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Official security administration and regulatory queries:
            </p>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline font-mono text-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{ADMIN_EMAIL}</span>
            </a>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 End-to-End Encryption</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} PhoneTrace. All rights reserved. Registered telecom intelligence & consent-based sharing.
          </div>
          <div>
            Security Officer Contact: <span className="font-mono text-slate-400">{ADMIN_EMAIL}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
