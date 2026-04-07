// @ts-check
import { expect } from '@playwright/test';

// ── Player roster used across tests ──
export const PLAYERS = [
    { num: '1', name: 'Alice' },
    { num: '2', name: 'Bob' },
    { num: '3', name: 'Charlie' },
    { num: '4', name: 'Dana' },
    { num: '5', name: 'Eve' },
    { num: '6', name: 'Frank' },
    { num: '7', name: 'Grace' },
];

// ── Helpers ──

/** Parse MM:SS → total seconds */
export function parseTime(str) {
    const [m, s] = str.trim().split(':').map(Number);
    return m * 60 + s;
}

/** Zone locators for the game screen */
export function zones(page) {
    return {
        onCourt: page.locator('.zone').first(),
        bench: page.locator('.zone').nth(1),
    };
}

// ── Given steps ──

/** Given a fresh app with no data */
export async function givenFreshApp(page) {
    page.on('console', msg => console.log('PAGE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Wait for sql.js to load from CDN and the app to render
    await expect(page.locator('.hdr-title')).toContainText('SUBTRACKER', { timeout: 30_000 });
}

/** Given a roster of N players has been created */
export async function givenRosterCreated(page, players = PLAYERS) {
    await page.getByRole('button', { name: 'ROSTER' }).click();
    await expect(page.locator('.hdr-title')).toContainText('ROSTER');

    for (const p of players) {
        await page.getByPlaceholder('Player name…').fill(p.name);
        await page.locator('.field-row').last().locator('.inp-num').fill(p.num);
        await page.getByRole('button', { name: 'ADD', exact: true }).click();
    }

    await expect(page.locator('.sec-hd-sub', { hasText: /active/ }))
        .toContainText(`${players.length} active`);

    await page.getByRole('button', { name: 'SAVE' }).click();
    await expect(page.getByRole('button', { name: '✓ SAVED' })).toBeVisible();
    await page.getByRole('button', { name: '← BACK' }).click();
    await expect(page.locator('.hdr-title')).toContainText('SUBTRACKER');
}

/** Given a new game has been started against an opponent */
export async function givenGameStarted(page, opponent = 'Test Opponent') {
    await page.getByRole('button', { name: '+ NEW GAME' }).click();
    await page.locator('.inp-full').fill(opponent);
    await page.getByRole('button', { name: 'TIP OFF →' }).click();
    await expect(page.locator('.hdr-title')).toContainText(`vs ${opponent}`);
    await expect(page.locator('.clock-disp')).toHaveText('00:00');
}

// ── When steps ──

/** When the clock is started */
export async function whenClockStarted(page) {
    await page.getByRole('button', { name: '▶ START' }).click();
    await expect(page.locator('.period-pill')).toContainText('LIVE');
}

/** When the clock is paused */
export async function whenClockPaused(page) {
    await page.getByRole('button', { name: '⏸ PAUSE' }).click();
    await expect(page.locator('.period-pill')).toContainText('STOPPED');
}

/** When the clock is zeroed */
export async function whenClockZeroed(page) {
    await page.getByRole('button', { name: 'ZERO' }).click();
    // Wait for the RAF loop to pick up the reset
    await page.waitForTimeout(200);
    await expect(page.locator('.clock-disp')).toHaveText('00:00');
}

/** When the clock runs for N seconds then pauses */
export async function whenClockRunsFor(page, ms) {
    await whenClockStarted(page);
    await page.waitForTimeout(ms);
    await whenClockPaused(page);
}

/** When the quarter is changed */
export async function whenQuarterChanged(page, quarter) {
    await page.locator('.qbtn', { hasText: quarter }).click();
    await expect(page.locator('.period-pill')).toContainText(quarter);
}

/** When a substitution is made (playerOut from court, playerIn from bench) */
export async function whenSubstitutionMade(page, playerOut, playerIn) {
    const { onCourt, bench } = zones(page);
    await onCourt.locator('.pcard', { hasText: playerOut }).click();
    await bench.locator('.pcard', { hasText: playerIn }).click();
    await expect(page.locator('.sub-panel')).toBeVisible();
    await page.locator('.sbtn-ok').click();
    // Verify the swap happened
    await expect(bench.locator('.pcard', { hasText: playerOut })).toBeVisible();
    await expect(onCourt.locator('.pcard', { hasText: playerIn })).toBeVisible();
}

/** When the game is ended */
export async function whenGameEnded(page) {
    await page.getByRole('button', { name: 'END' }).click();
    await expect(page.locator('.hdr-title')).toContainText('SUBTRACKER');
}

/** When the stats modal is opened */
export async function whenStatsOpened(page) {
    await page.getByRole('button', { name: 'STATS' }).click();
    await expect(page.locator('.modal-title')).toContainText('PLAYER STATS');
}

/** When the log modal is opened */
export async function whenLogOpened(page) {
    await page.getByRole('button', { name: 'LOG' }).click();
    await expect(page.locator('.modal-title')).toContainText('GAME LOG');
}

/** When a modal is closed */
export async function whenModalClosed(page) {
    await page.getByRole('button', { name: 'CLOSE' }).click();
}

// ── Then steps ──

/** Then the clock should show approximately N seconds */
export async function thenClockShowsApprox(page, expectedSecs, toleranceSecs = 5) {
    const actual = parseTime(await page.locator('.clock-disp').textContent());
    expect(actual).toBeGreaterThanOrEqual(expectedSecs - toleranceSecs);
    expect(actual).toBeLessThanOrEqual(expectedSecs + toleranceSecs);
}

/** Then a player's court time should be approximately N seconds */
export async function thenPlayerTimeApprox(page, playerName, expectedSecs, toleranceSecs = 5) {
    const { onCourt, bench } = zones(page);
    // Try on court first, then bench
    let card = onCourt.locator('.pcard', { hasText: playerName });
    if (await card.count() === 0) card = bench.locator('.pcard', { hasText: playerName });
    const secs = parseTime(await card.locator('.ptime').textContent());
    expect(secs).toBeGreaterThanOrEqual(expectedSecs - toleranceSecs);
    expect(secs).toBeLessThanOrEqual(expectedSecs + toleranceSecs);
}

/** Then stats should show player percentage in a range */
export async function thenStatsPercentageInRange(page, playerName, minPct, maxPct) {
    const row = page.locator('.modal .srow', { hasText: playerName });
    const pctVal = parseFloat(await row.locator('.srow-pct').textContent());
    expect(pctVal).toBeGreaterThanOrEqual(minPct);
    expect(pctVal).toBeLessThanOrEqual(maxPct);
}

/** Then stats should be sorted by time descending */
export async function thenStatsSortedDescending(page) {
    const allTimes = await page.locator('.modal .srow .srow-time').allTextContents();
    const allSecs = allTimes.map(parseTime);
    for (let i = 1; i < allSecs.length; i++) {
        expect(allSecs[i]).toBeLessThanOrEqual(allSecs[i - 1]);
    }
}

/** Then the log should contain at least N entries */
export async function thenLogHasAtLeast(page, minCount) {
    const count = await page.locator('.modal .log-entry').count();
    expect(count).toBeGreaterThanOrEqual(minCount);
}

/** Then the log should contain at least N entries matching text */
export async function thenLogHasEntriesMatching(page, text, minCount) {
    const count = await page.locator('.modal .log-entry', { hasText: text }).count();
    expect(count).toBeGreaterThanOrEqual(minCount);
}

/** Then the game should appear in history as done */
export async function thenGameInHistory(page, opponent) {
    await page.getByRole('button', { name: 'HISTORY' }).click();
    await expect(page.locator('.game-card', { hasText: opponent })).toBeVisible();
    await expect(page.locator('.game-badge')).toContainText('DONE');
}
