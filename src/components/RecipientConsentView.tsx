import { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  MapPin,
  Lock,
  AlertTriangle,
  Square,
  CheckCircle2,
  Clock,
  ArrowLeft,
  XCircle
} from 'lucide-react';
import { ShareSession } from '../types';

interface RecipientConsentViewProps {
  token: string;
  onExit: () => void;
}

export default function RecipientConsentView({ token, onExit }: RecipientConsentViewProps) {
  const [session, setSession] = useState<ShareSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSharingActive, setIsSharingActive] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastFixTime, setLastFixTime] = useState<string | null>(null);

  // Fetch Session Details
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/share/${token}`);
        if (!res.ok) {
          throw new Error('This location sharing session is invalid or has expired.');
        }
        const data: ShareSession = await res.json();
        if (isMounted) {
          setSession(data);
          if (data.status === 'active') {
            setIsSharingActive(true);
          }
        }
      } catch (err: any) {
        if (isMounted) setErrorMsg(err.message || 'Could not load sharing session.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Clean up geolocation watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const handleGrantConsent = async () => {
    setErrorMsg(null);

    if (!('geolocation' in navigator)) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    try {
      // 1. Send consent grant to backend
      const consentRes = await fetch(`/api/share/${token}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: true }),
      });

      if (!consentRes.ok) {
        const d = await consentRes.json();
        throw new Error(d.error || 'Failed to update consent');
      }

      setIsSharingActive(true);

      // 2. Start watching position
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
          setCurrentAccuracy(Math.round(accuracy));
          setLastFixTime(new Date().toLocaleTimeString());

          // Send fix to server
          await fetch(`/api/share/${token}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy,
              altitude,
              speed,
              heading,
            }),
          });
        },
        (geoError) => {
          console.error(geoError);
          setErrorMsg(`Location Error: ${geoError.message}. Please enable location permissions.`);
          setIsSharingActive(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000,
        }
      );

      setWatchId(id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to grant permission');
    }
  };

  const handleDecline = async () => {
    try {
      await fetch(`/api/share/${token}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: false }),
      });
      onExit();
    } catch (err) {
      onExit();
    }
  };

  const handleStopSharing = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    try {
      const res = await fetch(`/api/share/${token}/stop`, { method: 'POST' });
      if (res.ok) {
        const d = await res.json();
        setSession(d.session);
        setIsSharingActive(false);
      }
    } catch (e) {
      console.error(e);
      setIsSharingActive(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-slate-300 font-medium text-sm">Verifying secure sharing session...</div>
      </div>
    );
  }

  if (errorMsg && !session) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 rounded-2xl border border-red-900/60 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-950 flex items-center justify-center">
          <XCircle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Session Unavailable</h3>
        <p className="text-xs text-slate-400">{errorMsg}</p>
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">PhoneTrace Consent Gateway</span>
        </div>
      </div>

      {/* Main Request Notice */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center">
          <MapPin className="w-7 h-7 text-emerald-400 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white">Live Location Request</h2>
        <p className="text-xs text-slate-300 max-w-sm mx-auto">
          <strong className="text-emerald-400 font-semibold">{session.requesterName}</strong> is requesting your live GPS coordinates with your explicit consent.
        </p>
      </div>

      {/* Session Details Box */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
        {session.targetPhone && (
          <div className="flex justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Target Phone</span>
            <span className="font-mono text-cyan-300">{session.targetPhone}</span>
          </div>
        )}
        <div className="flex justify-between py-1 border-b border-slate-800/80">
          <span className="text-slate-400">Purpose / Note</span>
          <span className="text-slate-200 font-medium text-right max-w-[240px] truncate">{session.message || 'None provided'}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-800/80">
          <span className="text-slate-400">Session Expiration</span>
          <span className="text-amber-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {session.durationMinutes} minutes maximum
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-slate-400">Privacy Status</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Encrypted End-to-End
          </span>
        </div>
      </div>

      {/* Sharing Active HUD or Consent Prompt */}
      {isSharingActive ? (
        <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-sm text-emerald-300">Actively Broadcasting Location</span>
            </div>
            {currentAccuracy && (
              <span className="text-xs font-mono text-emerald-400">
                Accuracy: ±{currentAccuracy}m
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300">
            Your coordinates are streaming securely to <strong className="text-white">{session.requesterName}</strong>. You may stop sharing anytime below.
          </p>

          {lastFixTime && (
            <div className="text-[11px] text-slate-400 font-mono">
              Last GPS sync: {lastFixTime}
            </div>
          )}

          <button
            onClick={handleStopSharing}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition cursor-pointer"
          >
            <Square className="w-4 h-4" />
            <span>Stop & Revoke Location Sharing Now</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Your Privacy Rights:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>No background tracking without this browser tab active.</li>
              <li>Location data automatically deletes upon session expiration.</li>
              <li>You can revoke access immediately with one tap.</li>
            </ul>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDecline}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Decline & Cancel
            </button>

            <button
              onClick={handleGrantConsent}
              className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Allow & Share Location</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
