import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Server,
  Key,
  Clock,
  UserCheck
} from 'lucide-react';

export default function SecurityAndContactView() {
  const ADMIN_EMAIL = 'wajhatbhai30@gmail.com';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Security / Privacy Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Health status from backend
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/system/health')
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setResponseMsg({ success: false, text: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setResponseMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry');

      setResponseMsg({ success: true, text: data.message });
      setMessage('');
    } catch (err: any) {
      setResponseMsg({ success: false, text: err.message || 'Submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Enterprise Security Infrastructure</span>
        </div>
        <h2 className="text-3xl font-black text-white">Security & Official Administration</h2>
        <p className="text-sm text-slate-400 mt-1">
          Cryptographic consent verification, strict data disposal, and verified security officer contact.
        </p>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>Zero Unconsented Tracking</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every live GPS session uses high-entropy random tokens and requires active browser permissions. We prohibit any stealth tracking.
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Key className="w-4 h-4" />
            <span>Ephemeral Expiry</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Coordinates and breadcrumb history exist only in memory during the active session window. All records are purged upon expiry.
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Server className="w-4 h-4" />
            <span>Rate Limiting & Protection</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            API endpoints enforce IP rate limiting, TLS 1.3 transport security, and sanitization to prevent automation abuse.
          </p>
        </div>
      </div>

      {/* Security Officer & System Health Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Designated Security Officer</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>Security Administration:</span>
              <a
                href={`mailto:${ADMIN_EMAIL}`}
                className="text-cyan-400 hover:underline font-mono text-lg"
              >
                {ADMIN_EMAIL}
              </a>
            </div>
            <p className="text-xs text-slate-400">
              For security vulnerability disclosures, regulatory notices, or emergency deletion requests, please contact our security team directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-right">
              <span className="text-slate-400 block text-[10px]">Security Gateway</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Operational (v2.5)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Contact & Security Dispatch Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              Direct Security & Admin Dispatch Form
            </h3>
            <span className="text-xs text-slate-400 font-mono">To: {ADMIN_EMAIL}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full h-10 bg-slate-950 border border-slate-700 rounded-lg px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Your Contact Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@domain.com"
                  className="w-full h-10 bg-slate-950 border border-slate-700 rounded-lg px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-10 bg-slate-950 border border-slate-700 rounded-lg px-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Security / Privacy Inquiry">Security / Privacy Inquiry</option>
                <option value="Data Deletion Request">Data Deletion Request</option>
                <option value="Carrier Data Correction">Carrier Data Correction</option>
                <option value="Enterprise API Access">Enterprise API Access</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Message Details *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry, report, or request..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>

            {responseMsg && (
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                responseMsg.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-red-950/40 border-red-800 text-red-300'
              }`}>
                {responseMsg.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{responseMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Dispatching to {ADMIN_EMAIL}...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Secure Inquiry to Admin ({ADMIN_EMAIL})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Info Column (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Compliance Specifications
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
                <span><strong>GDPR & CCPA Compliant:</strong> No consumer phone numbers are shared with advertisers or third parties.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
                <span><strong>Explicit Consent:</strong> Geolocation coordinates are only processed upon authenticated recipient confirmation.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
                <span><strong>Audit Log:</strong> Submissions to {ADMIN_EMAIL} receive formal verification and case reference tracking.</span>
              </div>
            </div>
          </div>

          {healthData && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Live System Diagnostics
              </h4>
              <div className="space-y-1.5 text-slate-400 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>System:</span>
                  <span className="text-slate-200">{healthData.system}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-emerald-400">{healthData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="text-cyan-300">{healthData.adminEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-slate-200">{healthData.uptimeSeconds} seconds</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
