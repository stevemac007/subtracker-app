import { test, expect } from '@playwright/test';

test('capture demo scenes', async ({ page }, testInfo) => {
  const outputDir = testInfo.outputDir;
  
  await page.setViewportSize({ width: 1024, height: 768 });
  
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.hdr-title', { timeout: 60000 });
  await page.waitForTimeout(1000);
  
  // Scene 1: Home screen (empty state)
  await page.screenshot({ path: `${outputDir}/scene1-home-empty.png`, fullPage: false });
  
  // Scene 2: Go to roster
  await page.click('button:has-text("ROSTER")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDir}/scene2-roster-empty.png`, fullPage: false });
  
  // Type team name
  await page.locator('.inp-team').fill('Westside Hawks');
  
  // Add 8 players quickly
  const players = [
    ['MJ', '23'], ['Penny', '7'], ['Shaq', '34'], ['Pip', '33'],
    ['Rodman', '91'], ['Kukoc', '1'], ['Kerr', '25'], ['Longley', '54'],
  ];
  for (const [name, num] of players) {
    await page.fill('input[placeholder="Player name…"]', name);
    await page.fill('input[placeholder="#"]', num);
    await page.click('button:has-text("ADD")');
  }
  
  await page.screenshot({ path: `${outputDir}/scene2b-roster-filled.png`, fullPage: false });
  
  // Save
  await page.click('button:has-text("SAVE")');
  await page.waitForTimeout(200);
  
  // Go back home
  await page.click('button:has-text("BACK")');
  await page.waitForTimeout(300);
  
  // Scene 3: New game
  await page.click('button:has-text("NEW GAME")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDir}/scene3-newgame.png`, fullPage: false });
  
  // Enter opponent
  await page.fill('input[placeholder="Opponent name…"]', 'Eastside Ballers');
  
  // Tip off
  await page.click('button:has-text("TIP OFF")');
  await page.waitForTimeout(500);
  
  // Scene 4: Live game
  await page.screenshot({ path: `${outputDir}/scene4-game-started.png`, fullPage: false });
  
  // Start clock, let it run briefly
  await page.click('button:has-text("START")');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: `${outputDir}/scene4b-clock-running.png`, fullPage: false });
  
  // Pause
  await page.click('button:has-text("PAUSE")');
  await page.waitForTimeout(300);
  
  // Substitution: tap #23 MJ on court to sub out
  await page.locator('.pcard.on-c').filter({ hasText: '#23' }).first().click();
  await page.waitForTimeout(150);
  
  // Tap #7 Penny on bench to sub in
  await page.locator('.pcard.bnch').filter({ hasText: '#7' }).first().click();
  await page.waitForTimeout(150);
  
  await page.screenshot({ path: `${outputDir}/scene4c-sub-panel.png`, fullPage: false });
  
  // Confirm substitution
  await page.click('button:has-text("CONFIRM SUB")');
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: `${outputDir}/scene4d-sub-done.png`, fullPage: false });
  
  // Scene 5: Stats overlay
  await page.click('button:has-text("STATS")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDir}/scene5-stats.png`, fullPage: false });
  
  // Close stats, open log
  await page.click('button:has-text("CLOSE")');
  await page.waitForTimeout(200);
  await page.click('button:has-text("LOG")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDir}/scene5b-log.png`, fullPage: false });
  
  console.log('All scenes captured! Output:', outputDir);
});
