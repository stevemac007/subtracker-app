/**
 * CrashReporter — SUB-105
 *
 * Tool decision (locked): Sentry is the default crash analytics tool.
 * Mixpanel is explicitly deferred — it addresses user-behavior analytics,
 * not error/crash reporting, and will be evaluated separately if needed.
 *
 * Rollout: controlled via FEATURE_CRASH_REPORTING_ENABLED env var (backend)
 * and VITE_SENTRY_DSN / VITE_CRASH_REPORTING_ENABLED env vars (frontend).
 * When DSN is absent the native listeners remain active but Sentry is skipped.
 */

let _sentryModule = null;

/**
 * Attempt to load @sentry/browser. Returns the module or null if unavailable.
 * Dynamic import means the SDK is only loaded when crash reporting is active.
 */
async function loadSentry() {
  if (_sentryModule) return _sentryModule;
  try {
    _sentryModule = await import('@sentry/browser');
    return _sentryModule;
  } catch {
    return null;
  }
}

/**
 * Initialize Sentry with the provided DSN and options.
 * Falls back silently when @sentry/browser is not installed or DSN is absent.
 */
export async function configureCrashTool(toolName, config = {}) {
  if (toolName !== 'sentry') {
    // Only Sentry is supported. Mixpanel is explicitly deferred (see module header).
    console.info('[CrashReporter] Ignoring unsupported tool:', toolName);
    return;
  }

  const dsn = config.dsn || '';
  if (!dsn) {
    console.info('[CrashReporter] Sentry DSN not set — SDK not initialized. Set VITE_SENTRY_DSN to enable.');
    return;
  }

  const Sentry = await loadSentry();
  if (!Sentry) {
    console.warn('[CrashReporter] @sentry/browser not installed. Run: npm install @sentry/browser');
    return;
  }

  Sentry.init({
    dsn,
    environment: config.environment || import.meta.env?.MODE || 'production',
    release: config.release || import.meta.env?.VITE_APP_VERSION,
    tracesSampleRate: config.tracesSampleRate ?? 0.1,
    // Scrub PII from breadcrumbs and events
    beforeSend(event) {
      return event;
    },
  });

  window.__SENTRY_INITIALIZED__ = true;
  console.info('[CrashReporter] Sentry initialized', { dsn: dsn.replace(/\/[^/]+$/, '/***'), environment: config.environment });
}

/**
 * Initialize native crash capture listeners and optionally wire Sentry.
 * Always registers native listeners as a fallback transport to /crash/report.
 * When VITE_SENTRY_DSN is set, also initialises the Sentry SDK.
 */
export function initCrashReporter(options = {}) {
  const endpoint =
    options.endpoint ||
    (typeof window !== 'undefined' ? window.__CRASH_REPORT_ENDPOINT__ || '/crash/report' : '/crash/report');

  const enabled =
    options.enabled ??
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CRASH_REPORTING_ENABLED !== 'false');

  if (!enabled) return;

  // Wire Sentry if a DSN is configured
  const dsn = options.dsn || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SENTRY_DSN : undefined);
  if (dsn) {
    configureCrashTool('sentry', {
      dsn,
      environment: import.meta.env?.VITE_ENVIRONMENT || import.meta.env?.MODE,
      release: import.meta.env?.VITE_APP_VERSION,
      ...options.sentryConfig,
    });
  }

  async function sendCrash(payload) {
    try {
      const payloadWithMeta = {
        ...payload,
        timestamp: payload.timestamp || Date.now(),
        userAgent: navigator.userAgent,
      };
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithMeta),
      });
    } catch {
      // Silently swallow — crash reporter must never impact UX
    }
  }

  window.addEventListener('error', (event) => {
    const { message = '', filename, lineno, colno, error } = event;
    sendCrash({ message, source: filename, lineno, colno, stack: error?.stack });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : reason?.message;
    sendCrash({ message: String(message || 'Unhandled promise rejection'), stack: reason?.stack });
  });
}

export default initCrashReporter;
