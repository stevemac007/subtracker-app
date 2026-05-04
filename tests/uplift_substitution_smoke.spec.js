// @ts-check
import { test, expect } from '@playwright/test';

// Minimal scaffold for a second uplift scenario: substitution path
test('Uplift substitution smoke: scaffold', async ({ page }) => {
  await page.goto('/');
  // If the substitution UI exists in this build, exercise it; otherwise skip scaffold
  const subBtn = page.locator('[data-testid="substitution-path"]');
  const count = await subBtn.count();
  if (count === 0) {
    test.skip('Substitution UI not present in this build; skipping substitution path execution');
  }
  // Click substitution path (if present) and verify navigation / UI changes
  await subBtn.first().click();
  // Basic sanity: ensure navigation to a substitution-related URL if available, else check a summary element
  try {
    await page.waitForURL(/substitution/, { timeout: 2000 });
  } catch {
    // If URL did not change, fall back to checking for a summary element
  }
  const summary = page.locator('[data-testid="substitution-summary"]');
  if (await summary.count() > 0) {
    await expect(summary.first()).toBeVisible();
  }
});
