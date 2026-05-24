// @ts-check
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test('Diagnostics: print environment snapshot', async () => {
  // Run the diagnostics script and capture its output.
  let out = '';
  try {
    out = execSync('bash tools/diagnostics.sh', { encoding: 'utf8' });
  } catch (e) {
    // If diagnostics fail, surface a readable error in test output
    const errOut = e.stdout ? e.stdout.toString() : '';
    const err = e.stderr ? e.stderr.toString() : '';
    throw new Error('Diagnostics failed:\n' + (errOut + err));
  }
  // Assert that the script executed and produced output
  expect(out.length).toBeGreaterThan(0);
});
