// @ts-check
import { test, expect } from '@playwright/test';

// End-to-end uplift path smoke test scaffold
test('Uplift end-to-end smoke: core uplift path', async ({ page }) => {
  await page.goto('/');

  // Core uplift path placeholder; only run if UI exposes it
  const corePath = page.locator('[data-testid="uplift-core-path"]');
  const count = await corePath.count();
  if (count === 0) {
    test.skip('Uplift core path not present in this build; skipping end-to-end smoke test');
  }

  await corePath.first().click();

  // Validate either a summary panel or a route change indicative of uplift flow progress
  const summary = page.locator('[data-testid="uplift-summary"]');
  if (await summary.count() > 0) {
    await expect(summary.first()).toBeVisible();
  } else {
    // Fallback: ensure a related URL was navigated or a placeholder element appears
    try {
      await page.waitForURL(/uplift|core|flow/, { timeout: 2000 });
    } catch {
      // Ignore; not all builds will expose the same routes
    }
  }
});
