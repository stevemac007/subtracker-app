import { test, expect } from '@playwright/test';

test('capture demo scenes', async ({ page }, testInfo) => {
  const outputDir = testInfo.outputDir;
  
  await page.setViewportSize({ width: 1024, height: 768 });
  
  console.log('Loading app...');
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait for the app to render - either the header or the loader or error
  console.log('Waiting for app to render...');
  await Promise.race([
    page.waitForSelector('.hdr-title', { timeout: 45000 }),
    page.waitForSelector('.loader', { timeout: 45000 }),
  ]);
  
  // If it's still loading, wait a bit more
  const hasLoader = await page.locator('.loader').isVisible().catch(() => false);
  if (hasLoader) {
    console.log('Still loading, waiting for header...');
    await page.waitForSelector('.hdr-title', { timeout: 45000 });
  }
  
  console.log('App loaded, waiting 2s for stability...');
  await page.waitForTimeout(2000);
  
  // Scene 1: Home screen
  await page.screenshot({ path: `${outputDir}/scene1-home.png`, fullPage: false });
  console.log('Scene 1 captured');
  
  // Navigate to roster
  const rosterBtn = page.locator('button:has-text("ROSTER")');
  if (await rosterBtn.isVisible()) {
    await rosterBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${outputDir}/scene2-roster.png`, fullPage: false });
    console.log('Scene 2 captured');
  } else {
    console.log('ROSTER button not visible, current page:');
    console.log(await page.content().then(c => c.substring(0, 500)));
  }
});
