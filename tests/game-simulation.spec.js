// @ts-check
import { test } from '@playwright/test';
import {
    PLAYERS, parseTime, zones,
    givenFreshApp, givenRosterCreated, givenGameStarted,
    whenClockStarted, whenClockPaused, whenClockRunsFor,
    whenQuarterChanged, whenSubstitutionMade, whenGameEnded,
    whenStatsOpened, whenLogOpened, whenModalClosed,
    thenClockShowsApprox, thenPlayerTimeApprox,
    thenStatsPercentageInRange, thenStatsSortedDescending,
    thenLogHasAtLeast, thenLogHasEntriesMatching, thenGameInHistory,
} from './helpers.js';

test.describe('Feature: Full game simulation across 4 quarters', () => {

    test.beforeEach(async ({ page }) => {
        await givenFreshApp(page);
    });

    test('Scenario: Play a 4-quarter game with substitutions and verify stats and log', async ({ page }) => {

        // Given a roster of 7 players
        await givenRosterCreated(page, PLAYERS);

        // And a new game against "Test Opponent"
        await givenGameStarted(page, 'Test Opponent');

        // ── Q1 first half ──
        // When the clock runs for 30 seconds
        await whenClockRunsFor(page, 30_000);
        // Then the clock shows ~30s
        await thenClockShowsApprox(page, 30);

        // When Alice is subbed out for Frank
        await whenSubstitutionMade(page, 'Alice', 'Frank');

        // And the clock runs for another 30 seconds
        await whenClockRunsFor(page, 30_000);
        // Then the clock shows ~60s
        await thenClockShowsApprox(page, 60);
        // And Frank has ~30s court time (only second stint)
        await thenPlayerTimeApprox(page, 'Frank', 30);
        // And Alice has ~30s court time (sat out second stint)
        await thenPlayerTimeApprox(page, 'Alice', 30);

        // ── Q2 ──
        // When the quarter changes to Q2
        await whenQuarterChanged(page, 'Q2');

        // And the clock runs for 30 seconds
        await whenClockRunsFor(page, 30_000);

        // When Bob is subbed out for Alice
        await whenSubstitutionMade(page, 'Bob', 'Alice');

        // And the clock runs for another 30 seconds
        await whenClockRunsFor(page, 30_000);

        // ── Q3 ──
        await whenQuarterChanged(page, 'Q3');
        await whenClockRunsFor(page, 30_000);

        // ── Q4 ──
        await whenQuarterChanged(page, 'Q4');
        await whenClockRunsFor(page, 30_000);

        // Then the clock shows ~30s (current quarter only)
        await thenClockShowsApprox(page, 30);

        // ── Verify stats ──
        await whenStatsOpened(page);

        // Then players who never subbed out should be near 100%
        await thenStatsPercentageInRange(page, 'Charlie', 85, 105);
        await thenStatsPercentageInRange(page, 'Dana', 85, 105);
        await thenStatsPercentageInRange(page, 'Eve', 85, 105);

        // And players who were subbed out should have partial time
        await thenStatsPercentageInRange(page, 'Alice', 10, 90);
        await thenStatsPercentageInRange(page, 'Bob', 10, 90);

        // And stats are sorted by time descending
        await thenStatsSortedDescending(page);
        await whenModalClosed(page);

        // ── Verify log ──
        await whenLogOpened(page);
        // 6 starts + 6 pauses + 3 quarter changes + 2 subs = 17
        await thenLogHasAtLeast(page, 17);
        await thenLogHasEntriesMatching(page, '→', 2);
        await thenLogHasEntriesMatching(page, 'Clock started', 6);
        await thenLogHasEntriesMatching(page, 'Clock paused', 6);
        await whenModalClosed(page);

        // ── End game and verify history ──
        await whenGameEnded(page);
        await thenGameInHistory(page, 'Test Opponent');
    });
});
