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
