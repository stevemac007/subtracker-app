## Why

SubTracker currently runs as a browser-based React SPA. While functional, this limits the user experience — coaches need a native app that launches instantly, works fully offline without CDN dependencies, integrates with device features (haptics, wake lock, notifications), and is discoverable on the Google Play Store. An Android native app delivers the reliability and polish expected for courtside use during live games.

## What Changes

- Build a native Android application (Kotlin, Jetpack Compose) that replicates all SubTracker functionality
- Replace browser-based SQLite (sql.js/WASM via CDN) with native SQLite via Room persistence library
- Replace localStorage persistence with Room's built-in file-based database
- Replace CSS-based theming with Compose Material 3 dynamic theming (4 themes: Scoreboard, Midnight, Chalk, High Contrast)
- Replace state-driven screen navigation with Jetpack Navigation Compose
- Implement native game clock using Android chronometer/coroutines instead of requestAnimationFrame
- Support screen wake lock via native Android PowerManager/WakeLock API
- Target Android 8.0+ (API 26+) for broad device coverage

## Capabilities

### New Capabilities
- `team-management`: Create, rename, switch between, and delete teams with all associated data cascade
- `roster-management`: Add, edit, toggle active/inactive, and delete players with jersey numbers scoped to a team
- `game-setup`: Configure opponent, period format (quarters/halves), clock direction (up/down), period duration, squad selection (up to 12), and starter selection (exactly 5)
- `live-game`: Real-time game clock with start/pause/zero, period tracking (Q1-Q4/H1-H2 + OT), tap-to-substitute with multi-swap confirmation, live court time and stint tracking per player, substitution log, player stats overlay
- `game-history`: Browse past games, view detailed game summary with player stats and event log, resume in-progress games, delete games
- `local-database`: Room-based SQLite persistence with the same schema (team, players, games, game_players, substitutions, game_events tables) and automatic migration support
- `app-theming`: Four color themes (Scoreboard, Midnight, Chalk, High Contrast) persisted in preferences, applied via Compose theming

### Modified Capabilities

## Impact

- **New codebase**: Entirely new Android project (Kotlin + Jetpack Compose) — no modifications to the existing React SPA
- **Dependencies**: Room, Navigation Compose, Material 3, Kotlin Coroutines, DataStore Preferences
- **Data**: No data migration from browser — fresh start on device (existing web app remains independent)
- **Distribution**: New Google Play Store listing required
- **Testing**: Instrumented tests for Room DAOs, UI tests for Compose screens, unit tests for clock/substitution logic
