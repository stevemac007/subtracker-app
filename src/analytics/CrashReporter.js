export function initCrashReporter(options = {}) {
  const endpoint =
    options.endpoint || (typeof window !== 'undefined' ? (window.__CRASH_REPORT_ENDPOINT__ || '/crash/report') : '/crash/report');

  async function sendCrash(payload) {
    try {
      const payloadWithMeta = {
        ...payload,
        timestamp: payload.timestamp || Date.now(),
        userAgent: navigator.userAgent,
      };
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadWithMeta),
      });
    } catch (e) {
      // Silently swallow to avoid impacting UX if backend is unavailable
    }
  }

  // Global runtime errors
  window.addEventListener('error', (event) => {
    const { message = '', filename, lineno, colno, error } = event;
    sendCrash({
      message,
      source: filename,
      lineno,
      colno,
      stack: error?.stack,
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' ? reason : reason?.message;
    const stack = reason?.stack;
    sendCrash({
      message: String(message || 'Unhandled promise rejection'),
      stack,
    });
  });
}

export default initCrashReporter;

// Skeleton hook for tool-specific initialization. Allows moving forward with architecture
// while deferring heavy SDK imports until a concrete plan is approved.
export function configureCrashTool(toolName, config = {}) {
  if (!toolName) return;
  // Lightweight, safe stubs for future SDK initializations.
  // Real SDK initialization should replace these stubs once a tool is selected and dependencies added.
  if (toolName === 'sentry') {
    // Stubbed Sentry initialization
    const dsn = config.dsn || '';
    window.__SENTRY_INITIALIZED__ = true;
    console.info('[CrashReporter] Sentry stub initialized', { dsn });
    // In a real setup, you'd import * as Sentry from '@sentry/node' or '@sentry/browser' and configure it here.
  } else if (toolName === 'firebase') {
    console.info('[CrashReporter] Firebase stub requested', config);
  } else {
    console.info('[CrashReporter] Unknown crash tool requested', toolName, config);
  }
  // Still expose a log for visibility
  console.log(`Crash tool configuration requested: ${toolName}`, config);
}
