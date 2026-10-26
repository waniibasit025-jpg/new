import { ShieldAlert, Cpu, Radio, Lock, CheckCircle2, XCircle, BookOpen, AlertTriangle } from 'lucide-react';

export default function TelecomEducationView() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Industry Telecommunications Architecture</span>
        </div>
        <h2 className="text-3xl font-black text-white">How Phone Number Intelligence Works</h2>
        <p className="text-sm text-slate-400 mt-1">
          The technical and legal truth about phone registries, SS7 telecom signaling, and why exact live GPS requires device permission.
        </p>
      </div>

      {/* Myth vs Reality Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scam Myth */}
        <div className="bg-red-950/20 rounded-2xl border border-red-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-red-400 font-bold text-base">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>The Deceptive Scam Claim</span>
          </div>
          <p className="text-xs text-red-200/90 leading-relaxed">
            Predatory websites claim: <em>"Enter any phone number and view their real-time satellite GPS tracking on a map silently without them knowing."</em>
          </p>
          <div className="p-3 bg-red-950/50 rounded-xl border border-red-900/50 text-[11px] text-red-300 space-y-1">
            <strong>Why it's a technical scam:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1 text-red-200/80">
              <li>Websites cannot query cellular base stations or device GPS chips without user permission.</li>
              <li>Civilian websites do not have access to real-time telecom SS7/Diameter lawful interception nodes.</li>
              <li>Apps claiming otherwise show fake simulated animations and bill recurring subscriptions.</li>
            </ul>
          </div>
        </div>

        {/* Real Engineering Reality */}
        <div className="bg-emerald-950/20 rounded-2xl border border-emerald-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>How PhoneTrace Works Realistically</span>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            PhoneTrace delivers verified telecom registry intelligence, followed by an encrypted consent gateway for real GPS sharing.
          </p>
          <div className="p-3 bg-emerald-950/50 rounded-xl border border-emerald-900/50 text-[11px] text-emerald-300 space-y-1">
            <strong>Our verified methodology:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1 text-emerald-200/80">
              <li><strong>ITU-T E.164:</strong> Parses country calling codes, area prefixes, and carrier blocks.</li>
              <li><strong>Exchange Region:</strong> Maps the geographic telecom circle (exchange area centroid).</li>
              <li><strong>Consent-Based Live GPS:</strong> Sends an encrypted sharing link where the recipient taps "Allow" to stream coordinates via browser Geolocation.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Concepts Deep Dive */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          Telecom Architecture Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Radio className="w-4 h-4" />
              <span>HLR & VLR Registers</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Home Location Registers (HLR) and Visitor Location Registers (VLR) are internal carrier databases that track which cellular tower a phone is roaming on for call routing.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>ITU-T E.164 Standards</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The international numbering plan managed by the International Telecommunication Union defines national destination codes (NDCs) that indicate fixed wireline states or mobile networks.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>W3C Geolocation API</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Hardware GPS, WiFi positioning, and cell tower trilateration chips on modern smartphones are protected by the operating system sandbox and require explicit user consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
