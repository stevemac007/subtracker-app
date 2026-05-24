import express from 'express';
import { isFeatureEnabled } from './flags.js';
import { charge as gatewayCharge } from './gateway/index.js';

// Sentry backend initialisation — SUB-105
// Activated when SENTRY_DSN env var is set and crash_reporting flag is on.
// @sentry/node must be installed (npm install @sentry/node).
if (isFeatureEnabled('crash_reporting') && process.env.SENTRY_DSN) {
  try {
    const Sentry = await import('@sentry/node');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'production',
      release: process.env.APP_VERSION,
      tracesSampleRate: 0.1,
    });
    console.log('[Sentry] Backend SDK initialised');
  } catch {
    console.warn('[Sentry] @sentry/node not installed — backend SDK skipped. Run: npm install @sentry/node');
  }
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Health check for payments subdomain
app.get('/payments/health', (req, res) => {
  res.json({ status: 'ok', featureFlags: {
    payments: isFeatureEnabled('payments'),
    auth: isFeatureEnabled('auth')
  }});
});

// Simple mock-charge endpoint guarded by feature flag
app.post('/payments/charge', async (req, res) => {
  if (!isFeatureEnabled('payments')) {
    return res.status(503).json({ error: 'Payments feature is disabled' });
  }

  const { amount, currency, customerId } = req.body || {};
  // Minimal validation
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // In a real system, call the gateway provider
  try {
    const result = await gatewayCharge({ amount, currency, customerId });
    res.json({ success: true, amount, currency: currency ?? 'USD', id: result.id, gatewayStatus: result.status, customerId });
  } catch (err) {
    res.status(500).json({ error: 'Payment gateway error', detail: err?.message });
  }
});

// Crash reporting endpoint: accepts lightweight crash/telemetry payloads from the frontend
app.post('/crash/report', (req, res) => {
  // Gate crash reporting behind a feature flag for controlled rollout
  if (!isFeatureEnabled('crash_reporting')) {
    return res.status(503).json({ error: 'Crash reporting feature is disabled' });
  }
  try {
    const payload = req.body || {};
    payload.timestamp = payload.timestamp || Date.now();
    // Log the crash payload for debugging/observability
    // eslint-disable-next-line no-console
    console.log('Crash report received:', payload);
    res.json({ received: true, timestamp: payload.timestamp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process crash report' });
  }
});

// License validation endpoint
app.get('/license/validate', (req, res) => {
  if (!isFeatureEnabled('license')) {
    return res.status(503).json({ status: 'disabled' });
  }
  const key = process.env.LICENSE_KEY;
  if (!key) {
    return res.status(401).json({ valid: false, message: 'License key not configured' });
  }
  res.json({ valid: true, key: '******' });
});

// Simple auth health (stubbed)
app.get('/auth/health', (req, res) => {
  if (!isFeatureEnabled('auth')) {
    return res.status(503).json({ status: 'disabled' });
  }
  res.json({ status: 'ok' });
});

// Simple in-memory authentication mock
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  // In a real system we'd verify credentials here.
  const token = `mock-token-${username}`;
  res.json({ token, user: username });
});

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice('Bearer '.length);
  if (!token.startsWith('mock-token-')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.user = token.slice('mock-token-'.length);
  next();
}

app.get('/auth/validate', requireAuth, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend scaffold listening on port ${PORT}`);
});
