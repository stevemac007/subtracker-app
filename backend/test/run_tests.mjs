// Lightweight backend integration smoke tests
// Assumes backend server is already running on default port 3001

// Polyfill a minimal fetch() if running in a Node.js environment without global fetch
if (typeof globalThis.fetch !== 'function') {
  const { default: httpModule } = await import('node:http');
  const { default: httpsModule } = await import('node:https');
  globalThis.fetch = async (url, options = {}) => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? httpsModule : httpModule;
    const method = (options.method || 'GET').toUpperCase();
    const headers = Object.assign({}, options.headers || {});
    const body = options.body || null;
    return new Promise((resolve, reject) => {
      const req = lib.request(
        {
          hostname: u.hostname,
          port: u.port ? Number(u.port) : (u.protocol === 'https:' ? 443 : 80),
          path: u.pathname + u.search,
          method,
          headers,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            resolve({
              status: res.statusCode,
              ok: res.statusCode >= 200 && res.statusCode < 300,
              json: async () => JSON.parse(data || '{}'),
            });
          });
        }
      );
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  };
}
console.log('Running backend smoke tests...');

async function main() {
  const base = 'http://localhost:3001';
  const fetch = global.fetch;
  try {
    let r = await fetch(`${base}/payments/health`);
    let data = await r.json();
    console.log('payments/health ->', data);

    // Attempt login flow
    r = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'tester', password: 'secret' }),
    });
    data = await r.json();
    console.log('auth/login ->', data);

    if (!data || !data.token) {
      throw new Error('login failed: missing token');
    }

    // Validate auth using token
    r = await fetch(`${base}/auth/validate`, {
      headers: { 'Authorization': `Bearer ${data.token}` }
    });
    data = await r.json();
    console.log('auth/validate ->', data);

    // Attempt a real charge via payments gateway
    r = await fetch(`${base}/payments/charge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 150, currency: 'USD', customerId: data.user })
    });
    data = await r.json();
    console.log('payments/charge ->', data);

    // SUB-105: crash reporting endpoint smoke test
    r = await fetch(`${base}/crash/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test crash report',
        stack: 'Error: Test\n    at smoke_test (run_tests.mjs:1:1)',
        source: 'run_tests.mjs',
      }),
    });
    data = await r.json();
    console.log('crash/report ->', data);
    if (!data.received) {
      throw new Error('crash/report did not return received:true');
    }

  } catch (err) {
    console.error('Backend smoke tests failed:', err);
    process.exit(1);
  }
  console.log('Backend smoke tests completed successfully');
}

(async () => {
  await main();
})();
