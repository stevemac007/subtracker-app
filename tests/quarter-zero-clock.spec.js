// @ts-check
import { test, expect } from '@playwright/test';
import {
    PLAYERS, parseTime, zones,
    givenFreshApp, givenRosterCreated, givenGameStarted,
    whenClockStarted, whenClockPaused, whenClockRunsFor, whenClockZeroed,
    whenQuarterChanged, whenSubstitutionMade, whenGameEnded,
    whenStatsOpened, whenLogOpened, whenModalClosed,
    thenClockShowsApprox, thenPlayerTimeApprox,
    thenStatsPercentageInRange, thenStatsSortedDescending,
    thenLogHasAtLeast, thenLogHasEntriesMatching, thenGameInHistory,
} from './helpers.js';

test.describe('Feature: Clock zeroed between quarters preserves total game time', () => {

    test.beforeEach(async ({ page }) => {
        await givenFreshApp(page);
    });

    test('Scenario: 2-quarter game with clock zero between quarters and subs every 15s', async ({ page }) => {
        /*
         * Simulates real-world usage where the coach zeros the clock each quarter.
         *
         * Q1 = 1 min (4 × 15s segments with subs between each)
         * Break = 15s pause (clock stopped, then zeroed)
         * Q2 = 1 min (4 × 15s segments with subs between each)
         *
         * Total running time = ~2 min
         * Starters: Alice(1), Bob(2), Charlie(3), Dana(4), Eve(5)
         * Bench:    Frank(6), Grace(7)
         */

        // Given a roster and a new game
        await givenRosterCreated(page, PLAYERS);
        await givenGameStarted(page, 'Quarter Zero Test');

        const { onCourt, bench } = zones(page);

        // ════════════════════════════════════════════════════════
        // Q1: 4 × 15s segments with a sub after each segment
        // ════════════════════════════════════════════════════════

        // Q1 segment 1: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 15);

        // Sub: Alice out → Frank in
        await whenSubstitutionMade(page, 'Alice', 'Frank');

        // Q1 segment 2: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 30);

        // Sub: Frank out → Alice in (rotate back)
        await whenSubstitutionMade(page, 'Frank', 'Alice');

        // Q1 segment 3: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 45);

        // Sub: Bob out → Grace in
        await whenSubstitutionMade(page, 'Bob', 'Grace');

        // Q1 segment 4: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 60, 7);

        // Then after Q1: clock shows ~60s
        // Alice played segments 1, 3, 4 = ~45s
        await thenPlayerTimeApprox(page, 'Alice', 45, 7);
        // Frank played segment 2 only = ~15s
        await thenPlayerTimeApprox(page, 'Frank', 15, 7);
        // Bob played segments 1, 2, 3 = ~45s
        await thenPlayerTimeApprox(page, 'Bob', 45, 7);
        // Grace played segment 4 = ~15s
        await thenPlayerTimeApprox(page, 'Grace', 15, 7);
        // Charlie, Dana, Eve played all 4 = ~60s
        await thenPlayerTimeApprox(page, 'Charlie', 60, 7);

        // ════════════════════════════════════════════════════════
        // Quarter break: 15s pause, then zero the clock
        // ════════════════════════════════════════════════════════

        // Simulate a real quarter break — clock is already paused
        await page.waitForTimeout(15_000);

        // Zero the clock (this is the key action being tested)
        await whenClockZeroed(page);

        // Then the display clock should be 00:00
        await thenClockShowsApprox(page, 0, 1);

        // But player times should NOT have changed
        await thenPlayerTimeApprox(page, 'Charlie', 60, 7);
        await thenPlayerTimeApprox(page, 'Alice', 45, 7);

        // ════════════════════════════════════════════════════════
        // Q2: Change quarter, 4 × 15s segments with subs
        // ════════════════════════════════════════════════════════

        await whenQuarterChanged(page, 'Q2');

        // Q2 segment 1: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 15);

        // Sub: Grace out → Bob in (bring Bob back)
        await whenSubstitutionMade(page, 'Grace', 'Bob');

        // Q2 segment 2: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 30);

        // Sub: Alice out → Frank in
        await whenSubstitutionMade(page, 'Alice', 'Frank');

        // Q2 segment 3: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 45);

        // Sub: Frank out → Alice in
        await whenSubstitutionMade(page, 'Frank', 'Alice');

        // Q2 segment 4: run 15s
        await whenClockRunsFor(page, 15_000);
        await thenClockShowsApprox(page, 60, 7);

        // ════════════════════════════════════════════════════════
        // Verify: clock display shows ~60s (Q2 only) but total
        // game time is ~120s and percentages reflect that
        // ════════════════════════════════════════════════════════

        // Display clock = Q2 time only (~60s)
        await thenClockShowsApprox(page, 60, 7);

        // Charlie, Dana, Eve played every segment of both quarters = ~120s
        await thenPlayerTimeApprox(page, 'Charlie', 120, 12);
        await thenPlayerTimeApprox(page, 'Dana', 120, 12);
        await thenPlayerTimeApprox(page, 'Eve', 120, 12);

        // ── Verify stats percentages use total game time, not display clock ──
        await whenStatsOpened(page);

        // Charlie/Dana/Eve should be ~100% (played all ~120s of ~120s total)
        await thenStatsPercentageInRange(page, 'Charlie', 85, 105);
        await thenStatsPercentageInRange(page, 'Dana', 85, 105);
        await thenStatsPercentageInRange(page, 'Eve', 85, 105);

        // All percentages should be <= 105% (no impossible values like 3877%)
        const statRows = page.locator('.modal .srow');
        const count = await statRows.count();
        for (let i = 0; i < count; i++) {
            const pctText = await statRows.nth(i).locator('.srow-pct').textContent();
            const pctVal = parseFloat(pctText);
            expect(pctVal).toBeLessThanOrEqual(105);
            expect(pctVal).toBeGreaterThanOrEqual(0);
        }

        await thenStatsSortedDescending(page);
        await whenModalClosed(page);

        // ── Verify log has all events ──
        await whenLogOpened(page);
        // 8 starts + 8 pauses + 1 quarter change + 6 subs = 23
        await thenLogHasAtLeast(page, 23);
        await thenLogHasEntriesMatching(page, '→', 6);
        await thenLogHasEntriesMatching(page, 'Clock started', 8);
        await thenLogHasEntriesMatching(page, 'Clock paused', 8);
        await whenModalClosed(page);

        // ── End game and verify in history ──
        await whenGameEnded(page);
        await thenGameInHistory(page, 'Quarter Zero Test');

        // Open game detail and verify total time is ~120s (not ~60s)
        await page.locator('.game-card', { hasText: 'Quarter Zero Test' }).click();
        const totalTimeText = await page.locator('.sec-hd-sub', { hasText: 'game time' }).textContent();
        // Extract MM:SS from "02:00 game time"
        const timeMatch = totalTimeText.match(/(\d{2}:\d{2})/);
        const totalSecs = parseTime(timeMatch[1]);
        expect(totalSecs).toBeGreaterThanOrEqual(108);
        expect(totalSecs).toBeLessThanOrEqual(140);
    });
});
