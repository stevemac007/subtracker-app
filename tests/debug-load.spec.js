import { test, expect } from '@playwright/test';

test('debug app load', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  
  console.log('Loading app...');
  const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('Response status:', response.status());
  
  // Wait a bit for JS to execute
  await page.waitForTimeout(10000);
  
  // Take screenshot to see what we have
  await page.screenshot({ path: `${testInfo.outputDir}/debug-load.png`, fullPage: false });
  
  // Get page content
  const title = await page.title();
  console.log('Page title:', title);
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body text:', bodyText.substring(0, 500));
  
  // Check for errors
  const errors = await page.evaluate(() => {
    return window.__errors || 'none';
  });
  console.log('Window errors:', errors);
  
  // Check if sql.js loaded
  const hasSql = await page.evaluate(() => !!window.initSqlJs);
  console.log('Has initSqlJs:', hasSql);
});
