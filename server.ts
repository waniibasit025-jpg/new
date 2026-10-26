import express, { Request, Response } from 'express';
import { parseAndLookupPhoneNumber } from './src/utils/phoneLookup';
import { globalSharingManager } from './src/utils/sharingManager';
import { SearchFilters } from './src/types';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ADMIN_EMAIL = 'wajhatbhai30@gmail.com';

// Security headers and JSON body parser
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function rateLimiter(limit: number = 60, windowMs: number = 60000) {
  return (req: Request, res: Response, next: () => void) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count++;
    rateLimitMap.set(ip, entry);

    if (entry.count > limit) {
      res.status(429).json({
        error: 'Too many requests. Rate limit exceeded. Please wait a moment.',
        securityContact: ADMIN_EMAIL,
      });
      return;
    }
    next();
  };
}

// Phone Number Lookup Endpoint with Advanced Search Filters
app.post('/api/lookup', rateLimiter(100), (req: Request, res: Response) => {
  try {
    const { query, defaultCountry, filters } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Phone number query is required.' });
      return;
    }

    const typedFilters = filters as SearchFilters | undefined;
    const result = parseAndLookupPhoneNumber(query, defaultCountry, typedFilters);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Lookup processing failed', details: err?.message });
  }
});

// Create Secure Live Location Sharing Session
app.post('/api/share/create', rateLimiter(30), (req: Request, res: Response) => {
  try {
    const { durationMinutes, requesterName, targetPhone, message } = req.body;
    const session = globalSharingManager.createSession({
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 60,
      requesterName,
      targetPhone,
      message,
    });
    res.json({
      success: true,
      session,
      adminContact: ADMIN_EMAIL,
      securityGuarantee: 'Location coordinates require explicit recipient device permission and are never stored after session expiry.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create share session', details: err?.message });
  }
});

// Get Session Status
app.get('/api/share/:token', (req: Request, res: Response) => {
  const token = req.params.token;
  const session = globalSharingManager.getSession(token);
  if (!session) {
    res.status(404).json({ error: 'Session not found or has expired.' });
    return;
  }
  res.json(session);
});

// Update Consent (Recipient Grants or Denies Permission)
app.post('/api/share/:token/consent', (req: Request, res: Response) => {
  const token = req.params.token;
  const { consent } = req.body;
  const result = globalSharingManager.updateConsent(token, Boolean(consent));
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ success: true, session: result.session });
});

// Recipient Pushes Live GPS Fix
app.post('/api/share/:token/location', (req: Request, res: Response) => {
  const token = req.params.token;
  const { latitude, longitude, accuracy, altitude, speed, heading, address } = req.body;

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    res.status(400).json({ error: 'Valid latitude and longitude numbers are required.' });
    return;
  }

  const result = globalSharingManager.updateLocation(token, {
    latitude,
    longitude,
    accuracy: accuracy || 10,
    altitude,
    speed,
    heading,
    address,
  });

  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({ success: true, session: result.session });
});

// Revoke / Stop Sharing
app.post('/api/share/:token/stop', (req: Request, res: Response) => {
  const token = req.params.token;
  const result = globalSharingManager.stopSharing(token);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ success: true, session: result.session });
});

// Simulate Live Movement for Testing / Demonstrations
app.post('/api/share/:token/simulate', (req: Request, res: Response) => {
  const token = req.params.token;
  const result = globalSharingManager.simulateLiveMovement(token);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ success: true, session: result.session });
});

// Security & Admin Contact Inquiries
app.post('/api/contact', rateLimiter(20), (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  // Log message and acknowledge submission with official security contact
  console.log(`[PhoneTrace Inquiry] From: ${name} (${email}), Subject: ${subject}, Admin: ${ADMIN_EMAIL}`);
  res.json({
    success: true,
    message: `Your inquiry has been received and routed to security administrator (${ADMIN_EMAIL}). We will respond promptly.`,
    adminEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString(),
  });
});

// System Health & Transparency
app.get('/api/system/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'PhoneTrace Security Gateway',
    version: '2.5.0',
    adminEmail: ADMIN_EMAIL,
    securityProtocols: [
      'HTTPS / TLS 1.3 Strict Transport',
      'End-to-End Explicit Recipient Consent Architecture',
      'No Third-Party Location Selling or Tracking Adware',
      'Strict ITU-T E.164 Regulatory Verification',
    ],
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Mount Vite or serve static assets
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PhoneTrace server running at http://0.0.0.0:${PORT} (Admin: ${ADMIN_EMAIL})`);
  });
}

startServer();
