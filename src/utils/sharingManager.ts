import { ShareSession, LiveLocationData, ShareSessionStatus } from '../types';

export class SharingManager {
  private sessions: Map<string, ShareSession> = new Map();

  createSession(options: {
    durationMinutes?: number;
    requesterName?: string;
    targetPhone?: string;
    message?: string;
  }): ShareSession {
    const duration = Math.min(Math.max(options.durationMinutes || 60, 5), 1440); // 5 mins to 24h
    const now = Date.now();
    const token = this.generateToken();
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const session: ShareSession = {
      id,
      token,
      createdAt: now,
      expiresAt: now + duration * 60 * 1000,
      durationMinutes: duration,
      requesterName: options.requesterName?.trim() || 'A PhoneTrace User',
      targetPhone: options.targetPhone?.trim(),
      message: options.message?.trim() || 'Requesting your live location for safety / meeting arrival.',
      status: 'pending_consent',
      history: [],
    };

    this.sessions.set(token, session);
    return session;
  }

  getSession(token: string): ShareSession | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    // Check expiry
    if (session.status !== 'stopped' && Date.now() > session.expiresAt) {
      session.status = 'expired';
    }

    return session;
  }

  updateConsent(token: string, consentGranted: boolean): { success: boolean; session?: ShareSession; error?: string } {
    const session = this.getSession(token);
    if (!session) return { success: false, error: 'Session not found' };

    if (session.status === 'expired') return { success: false, error: 'This sharing session has expired' };
    if (session.status === 'stopped') return { success: false, error: 'This sharing session was stopped' };

    if (consentGranted) {
      session.status = 'active';
    } else {
      session.status = 'declined';
      session.stoppedAt = Date.now();
    }

    return { success: true, session };
  }

  updateLocation(token: string, location: Omit<LiveLocationData, 'timestamp'> & { timestamp?: number }): { success: boolean; session?: ShareSession; error?: string } {
    const session = this.getSession(token);
    if (!session) return { success: false, error: 'Session not found' };

    if (session.status !== 'active') {
      return { success: false, error: `Session is ${session.status}. Recipient consent is required before sharing coordinates.` };
    }

    const loc: LiveLocationData = {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: Math.round(location.accuracy || 10),
      altitude: location.altitude ?? null,
      speed: location.speed ?? null,
      heading: location.heading ?? null,
      timestamp: location.timestamp || Date.now(),
      address: location.address,
    };

    session.currentLocation = loc;
    session.history.push(loc);

    // Keep history bounded to last 200 points
    if (session.history.length > 200) {
      session.history.shift();
    }

    return { success: true, session };
  }

  stopSharing(token: string, reason: string = 'Stopped by user'): { success: boolean; session?: ShareSession; error?: string } {
    const session = this.getSession(token);
    if (!session) return { success: false, error: 'Session not found' };

    session.status = 'stopped';
    session.stoppedAt = Date.now();
    return { success: true, session };
  }

  simulateLiveMovement(token: string): { success: boolean; session?: ShareSession; error?: string } {
    const session = this.getSession(token);
    if (!session) return { success: false, error: 'Session not found' };

    session.status = 'active';
    session.isSimulated = true;

    // Default base coordinates (e.g. San Francisco or New York or London if not set)
    const baseLat = session.currentLocation?.latitude || 37.7749;
    const baseLng = session.currentLocation?.longitude || -122.4194;

    // Small random step (around 50-100 meters)
    const deltaLat = (Math.random() - 0.5) * 0.0015;
    const deltaLng = (Math.random() - 0.5) * 0.0015;
    const newLat = baseLat + deltaLat;
    const newLng = baseLng + deltaLng;

    const loc: LiveLocationData = {
      latitude: Number(newLat.toFixed(6)),
      longitude: Number(newLng.toFixed(6)),
      accuracy: Math.floor(8 + Math.random() * 7), // 8-15m accuracy
      speed: Number((1.2 + Math.random() * 2.5).toFixed(1)), // walking/jogging speed in m/s
      heading: Math.floor(Math.random() * 360),
      altitude: 15,
      timestamp: Date.now(),
      address: 'Simulated Device GPS Broadcast (Testing Mode)',
    };

    session.currentLocation = loc;
    session.history.push(loc);
    return { success: true, session };
  }

  private generateToken(): string {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const globalSharingManager = new SharingManager();
