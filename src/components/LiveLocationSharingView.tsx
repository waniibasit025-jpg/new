import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Share2,
  Copy,
  Clock,
  ShieldCheck,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Navigation,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { ShareSession } from '../types';
import LeafletMap from './LeafletMap';

interface LiveLocationSharingViewProps {
  initialTargetPhone?: string;
  onOpenRecipientMode: (token: string) => void;
}

export default function LiveLocationSharingView({
  initialTargetPhone = '',
  onOpenRecipientMode,
}: LiveLocationSharingViewProps) {
  const [targetPhone, setTargetPhone] = useState(initialTargetPhone);
  const [requesterName, setRequesterName] = useState('Safety Dispatcher');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [message, setMessage] = useState('Please share your live GPS location for safe arrival.');
  const [isCreating, setIsCreating] = useState(false);
  const [activeSession, setActiveSession] = useState<ShareSession | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationIntervalRef = useRef<any>(null);

  // Poll for location updates if session is active or pending
  useEffect(() => {
    if (!activeSession || activeSession.status === 'stopped' || activeSession.status === 'expired') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/share/${activeSession.token}`);
        if (res.ok) {
          const updated: ShareSession = await res.json();
          setActiveSession(updated);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeSession?.token, activeSession?.status]);

  // Clean up simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, []);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/share/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationMinutes,
          requesterName,
          targetPhone,
          message,
        }),
      });

      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      setActiveSession(data.session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStopSession = async () => {
    if (!activeSession) return;
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
      setIsSimulating(false);
    }

    try {
      const res = await fetch(`/api/share/${activeSession.token}/stop`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setActiveSession(data.session);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getShareUrl = () => {
    if (!activeSession) return '';
    const base = window.location.origin;
    return `${base}?share=${activeSession.token}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleSimulation = async () => {
    if (!activeSession) return;

    if (isSimulating) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
      setIsSimulating(false);
    } else {
      setIsSimulating(true);

      // Trigger one immediately
      await fetch(`/api/share/${activeSession.token}/simulate`, { method: 'POST' });
      const res = await fetch(`/api/share/${activeSession.token}`);
      if (res.ok) setActiveSession(await res.json());

      // Then every 3 seconds
      simulationIntervalRef.current = setInterval(async () => {
        try {
          await fetch(`/api/share/${activeSession.token}/simulate`, { method: 'POST' });
          const update = await fetch(`/api/share/${activeSession.token}`);
          if (update.ok) setActiveSession(await update.json());
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
  };

  // Remaining time in minutes
  const remainingMinutes = activeSession
    ? Math.max(0, Math.round((activeSession.expiresAt - Date.now()) / (60 * 1000)))
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Title & Consent Guarantee */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Legitimate, Consent-Enforced Live GPS Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Live Location <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sharing</span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
          Create an encrypted, time-limited link to request live GPS coordinates. The recipient retains complete control and must explicitly grant permission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration or Active Session Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {!activeSession ? (
            /* Creation Form */
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  Request Live Location
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  Consent Required
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label htmlFor="target-phone-input" className="block font-medium text-slate-400 mb-1">
                    Recipient Phone Number (Optional Label)
                  </label>
                  <input
                    id="target-phone-input"
                    type="text"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    placeholder="e.g. +1 (415) 555-2671"
                    className="w-full h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="requester-name-input" className="block font-medium text-slate-400 mb-1">
                    Your Name or Organization
                  </label>
                  <input
                    id="requester-name-input"
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="e.g. Mom, Logistics Dispatch, John"
                    className="w-full h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="duration-select" className="block font-medium text-slate-400 mb-1">
                    Sharing Duration Limit
                  </label>
                  <select
                    id="duration-select"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full h-11 bg-slate-950 border border-slate-700 rounded-xl px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={15}>15 Minutes (Quick Arrival / Pickup)</option>
                    <option value={60}>1 Hour (Standard Transit)</option>
                    <option value={360}>6 Hours (Long Trip / Travel)</option>
                    <option value={1440}>24 Hours (Full Day Event)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message-input" className="block font-medium text-slate-400 mb-1">
                    Purpose / Message for Recipient
                  </label>
                  <textarea
                    id="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateSession}
                disabled={isCreating}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                {isCreating ? (
                  <span>Generating Secure Link...</span>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-950" />
                    <span>Create Secure Sharing Session</span>
                  </>
                )}
              </button>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Privacy Protection Standard
                </div>
                <p>
                  A phone number alone cannot legally or technically disclose live GPS. This session requires the recipient to tap the link and approve browser Geolocation access.
                </p>
              </div>
            </div>
          ) : (
            /* Active Session Management HUD */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Session Token</span>
                  <div className="text-base font-mono font-bold text-white">{activeSession.token}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 ${
                  activeSession.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                    : activeSession.status === 'pending_consent'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {activeSession.status.replace('_', ' ')}
                </span>
              </div>

              {/* Share Link Box */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">
                  Recipient Invitation Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={getShareUrl()}
                    className="flex-1 h-10 bg-slate-950 border border-slate-700 rounded-lg px-3 text-xs text-slate-200 font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="h-10 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Dispatch Action Channels */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi, please share your live GPS location with me here: ${getShareUrl()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send via WhatsApp</span>
                </a>

                <button
                  onClick={() => setShowQr(!showQr)}
                  className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showQr ? 'Hide QR' : 'Show QR Code'}</span>
                </button>
              </div>

              {showQr && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(getShareUrl())}`}
                    alt="Session QR Code"
                    className="w-36 h-36 mx-auto rounded-lg bg-white p-2"
                  />
                  <p className="text-[11px] text-slate-400">Scan with recipient camera to open consent screen</p>
                </div>
              )}

              {/* Status & Expiry info */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block mb-0.5">Expires In</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {remainingMinutes} min
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Recipient Fixes</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                    {activeSession.history.length} waypoints
                  </span>
                </div>
              </div>

              {/* Testing / Simulator Controls */}
              <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-800/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" />
                    Demo & Test Playground
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-200">
                    Simulator
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onOpenRecipientMode(activeSession.token)}
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                    <span>Open Recipient Tab</span>
                  </button>

                  <button
                    onClick={handleToggleSimulation}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                      isSimulating
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {isSimulating ? (
                      <>
                        <Square className="w-3 h-3" />
                        <span>Stop Simulation</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        <span>Simulate Route</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Session Controls */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleStopSession}
                  disabled={activeSession.status === 'stopped' || activeSession.status === 'expired'}
                  className="flex-1 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800/60 font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Terminate Session</span>
                </button>

                <button
                  onClick={() => {
                    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
                    setIsSimulating(false);
                    setActiveSession(null);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
                >
                  <span>New Request</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Map & Telemetry Radar (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Live GPS Radar & Tracking View
              </h3>
            </div>
            {activeSession?.currentLocation && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Fix: {activeSession.currentLocation.latitude.toFixed(4)}, {activeSession.currentLocation.longitude.toFixed(4)}
              </span>
            )}
          </div>

          {/* Interactive Map */}
          {activeSession && activeSession.currentLocation ? (
            <LeafletMap
              mode="live"
              liveLocation={activeSession.currentLocation}
              breadcrumbs={activeSession.history}
              title={`Live Track: ${activeSession.targetPhone || activeSession.token}`}
              height="480px"
            />
          ) : (
            /* Standby State */
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 h-[480px] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="relative w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping"></div>
                <Navigation className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-bold text-white">
                  {activeSession ? 'Waiting for Recipient Consent' : 'Awaiting Live Sharing Link'}
                </h4>
                <p className="text-xs text-slate-400">
                  {activeSession
                    ? 'The recipient has received the request. Once they tap "Allow & Share Location", coordinates will stream here in real-time.'
                    : 'Create a secure link on the left or test using the built-in simulator to see live GPS tracking with accuracy rings and route breadcrumbs.'}
                </p>
              </div>

              {activeSession && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleSimulation}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Demo Simulator</span>
                  </button>
                  <button
                    onClick={() => onOpenRecipientMode(activeSession.token)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Simulate Recipient Consent</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Telemetry Metrics Bar */}
          {activeSession?.currentLocation && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 rounded-xl border border-slate-800 p-3.5 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">GPS Precision</span>
                <span className="font-mono font-bold text-emerald-400">
                  ±{activeSession.currentLocation.accuracy} meters
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Current Speed</span>
                <span className="font-mono font-bold text-slate-200">
                  {activeSession.currentLocation.speed !== null && activeSession.currentLocation.speed !== undefined
                    ? `${(activeSession.currentLocation.speed * 3.6).toFixed(1)} km/h`
                    : 'Stationary'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Compass Heading</span>
                <span className="font-mono font-bold text-slate-200">
                  {activeSession.currentLocation.heading !== null && activeSession.currentLocation.heading !== undefined
                    ? `${Math.round(activeSession.currentLocation.heading)}°`
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Last Sync</span>
                <span className="font-mono font-bold text-cyan-300">
                  {new Date(activeSession.currentLocation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
