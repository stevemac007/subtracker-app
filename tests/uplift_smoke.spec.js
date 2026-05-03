// @ts-check
import { test, expect } from '@playwright/test';

test('Uplift smoke: app root loads', async ({ page }) => {
  await page.goto('/');
  const root = await page.$('#root');
  expect(root).not.toBeNull();
});
