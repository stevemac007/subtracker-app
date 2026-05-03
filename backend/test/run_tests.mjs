// Lightweight backend integration smoke tests
// Assumes backend server is already running on default port 3001
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

  } catch (err) {
    console.error('Backend smoke tests failed:', err);
    process.exit(1);
  }
  console.log('Backend smoke tests completed successfully');
}

(async () => {
  await main();
})();
