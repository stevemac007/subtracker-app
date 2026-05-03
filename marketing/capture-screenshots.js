import { chromium } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const PORT = 8899;
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

function startServer() {
  return new Promise((resolve) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.json': 'application/json',
    };
    const server = http.createServer((req, res) => {
      let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function captureScreenshots() {
  // Clean previous screenshots
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1024, height: 768 });
  
  const url = `http://localhost:${PORT}`;
  console.log('Loading app...');
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.hdr-title', { timeout: 60000 });
  await new Promise(r => setTimeout(r, 1000));
  
  // Scene 1: Home empty
  console.log('Scene 1: Home empty');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene1-home-empty.png') });
  
  // Scene 2: Roster
  console.log('Scene 2: Roster empty');
  await page.click('button:has-text("ROSTER")');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene2-roster-empty.png') });
  
  // Fill team name
  await page.locator('.inp-team').fill('Westside Hawks');
  
  // Add 8 players — use the "Add Player" section inputs specifically
  // The page has two # inputs and two name inputs. We need the ones in "ADD PLAYER" section.
  // Strategy: fill name first, then number, then click ADD
  const players = ['MJ', 'Penny', 'Shaq', 'Pip', 'Rodman', 'Kukoc', 'Kerr', 'Longley'];
  const numbers = ['23', '7', '34', '33', '91', '1', '25', '54'];
  
  for (let i = 0; i < players.length; i++) {
    // Get all inputs, the "Add Player" section is at the bottom
    const allInputs = page.locator('.scroll-area input');
    const count = await allInputs.count();
    // The last two inputs are the "Add Player" name and number fields
    const nameInput = allInputs.nth(count - 2);
    const numInput = allInputs.nth(count - 1);
    
    await nameInput.fill(players[i]);
    await numInput.fill(numbers[i]);
    await page.click('button:has-text("ADD")');
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log('Scene 2b: Roster filled');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene2b-roster-filled.png') });
  
  await page.click('button:has-text("SAVE")');
  await new Promise(r => setTimeout(r, 200));
  await page.click('button:has-text("BACK")');
  await new Promise(r => setTimeout(r, 300));
  
  // Scene 3: New game
  console.log('Scene 3: New game');
  await page.click('button:has-text("NEW GAME")');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene3-newgame.png') });
  
  await page.fill('input[placeholder="Opponent name…"]', 'Eastside Ballers');
  await page.click('button:has-text("TIP OFF")');
  await new Promise(r => setTimeout(r, 500));
  
  // Scene 4: Game
  console.log('Scene 4: Game started');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene4-game-started.png') });
  
  await page.click('button:has-text("START")');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Scene 4b: Clock running');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene4b-clock-running.png') });
  
  await page.click('button:has-text("PAUSE")');
  await new Promise(r => setTimeout(r, 300));
  
  // Substitution: tap first player on court (MJ) to sub out
  console.log('Scene 4c: Sub panel');
  await page.locator('.pcard.on-c').first().click();
  await new Promise(r => setTimeout(r, 150));
  // Tap first player on bench (Kukoc) to sub in
  await page.locator('.pcard.bnch').first().click();
  await new Promise(r => setTimeout(r, 150));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene4c-sub-panel.png') });
  
  await page.click('button:has-text("CONFIRM SUB")');
  await new Promise(r => setTimeout(r, 500));
  
  console.log('Scene 4d: Sub done');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene4d-sub-done.png') });
  
  // Scene 5: Stats
  console.log('Scene 5: Stats');
  await page.click('button:has-text("STATS")');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene5-stats.png') });
  
  await page.click('button:has-text("CLOSE")');
  await new Promise(r => setTimeout(r, 200));
  await page.click('button:has-text("LOG")');
  await new Promise(r => setTimeout(r, 300));
  
  console.log('Scene 5b: Log');
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'scene5b-log.png') });
  
  await browser.close();
  console.log('All scenes captured successfully!');
}

const server = await startServer();
try {
  await captureScreenshots();
} catch (err) {
  console.error('Error:', err.message);
  console.error(err.stack);
} finally {
  server.close();
}
