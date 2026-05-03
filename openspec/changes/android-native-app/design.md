## Context

SubTracker is a basketball substitution tracker that currently runs as a React 19 SPA with an in-browser SQLite database (sql.js WASM). All data persists in localStorage as a base64-encoded SQLite export. The app is a single-file architecture with state-driven navigation, custom CSS theming, and no backend.

The goal is to build a native Android app that replicates all functionality. The existing React app remains unchanged — this is a greenfield Android project that implements the same feature set using native Android technologies.

The existing database schema has 6 tables: `team`, `players`, `games`, `game_players`, `substitutions`, `game_events`. The app has 5 screens: Home, Roster, History, New Game, and Live Game. The live game screen is the most complex — it manages a real-time clock, court/bench player lists, multi-player substitution, and stint tracking.

## Goals / Non-Goals

**Goals:**
- Feature parity with the React SPA (all screens, all interactions, same data model)
- Native performance and reliability for courtside use during live games
- Fully offline — no network dependency at any point
- Clean, maintainable architecture using current Android best practices
- Same visual aesthetic adapted to Material 3 (dark scoreboard theme as default)

**Non-Goals:**
- Data sync between web and Android versions
- Backend or cloud services
- iOS version (future consideration)
- Tablet-optimized layouts (phone-first, single-column)
- Play Store listing and release pipeline (separate effort)

## Decisions

### 1. Kotlin + Jetpack Compose (not XML Views)

Compose is the modern Android UI toolkit, aligns with Google's direction, and maps well to the React component model the team already understands. The app is UI-heavy with real-time updates (clock, court times) which Compose handles efficiently via recomposition.

*Alternative: XML Views + ViewBinding* — more boilerplate, harder to express the dynamic game screen, declining ecosystem investment.

### 2. Room for persistence (not raw SQLite)

Room provides compile-time SQL verification, DAO pattern, Flow/coroutine integration, and migration support. The existing schema maps directly to Room entities. Room's reactive queries (Flow) replace the manual "query then setState" pattern in the React app.

*Alternative: SQLDelight* — good cross-platform option but unnecessary complexity for Android-only. Room has deeper Jetpack integration.

### 3. Single-module architecture with package-by-feature

```
app/
├── data/           # Room database, DAOs, entities
├── ui/
│   ├── home/
│   ├── roster/
│   ├── history/
│   ├── gamesetup/
│   ├── game/
│   ├── theme/
│   └── components/ # Shared composables (FitName, TeamSelector, etc.)
├── navigation/     # NavHost and route definitions
└── util/           # Clock formatting, date helpers
```

Single module keeps build times fast for an app this size. Package-by-feature keeps each screen self-contained. No need for multi-module until the app grows significantly.

*Alternative: Multi-module (core, feature modules)* — over-engineering for a single-developer app with 5 screens.

### 4. Navigation Compose with sealed class routes

Each screen maps to a sealed class route. The game screen receives `gameId` as a nav argument. This replaces the React app's `screen` state + `gameCtx` pattern.

Routes: `Home`, `Roster`, `History`, `GameSetup`, `Game(gameId: Int)`, `GameDetail(gameId: Int)`.

### 5. Game clock via Kotlin coroutines (not Handler/Chronometer)

A coroutine-based clock in a ViewModel ticks via `delay(16)` loop (≈60fps), matching the React app's `requestAnimationFrame` approach. Wall-clock deltas ensure accuracy regardless of frame timing. Court time accumulation uses the same stint-tracking pattern: record wall time at stint start, compute delta on pause/sub.

*Alternative: Android Chronometer widget* — too limited, doesn't support the multi-player stint tracking or pause/resume semantics needed.

### 6. DataStore Preferences for lightweight settings

Active team ID and selected theme are stored in DataStore Preferences (replacing localStorage). Room handles all game/player data.

### 7. Theme system via Compose MaterialTheme

Four themes (Scoreboard, Midnight, Chalk, High Contrast) defined as `ColorScheme` objects. Theme selection persisted in DataStore. Applied at the top-level `MaterialTheme` wrapper. The Scoreboard theme uses dark amber/green tones matching the existing CSS custom properties.

Custom typography using the same font stack: Bebas Neue (headings), DM Mono (clock/data), Inter (body). Loaded as bundled font resources (no CDN dependency).

### 8. Screen wake lock via native WakeLock API

The game screen acquires `PowerManager.PARTIAL_WAKE_LOCK` + `FLAG_KEEP_SCREEN_ON` on the window. Released when leaving the game screen. This replaces the browser's Screen Wake Lock API.

## Risks / Trade-offs

- **Clock precision on low-end devices** → Wall-clock delta approach (same as web version) is resilient to frame drops. Coroutine delay is a minimum, not exact, but deltas compensate.
- **Large roster scrolling on game screen** → LazyColumn for bench list. Court list is always ≤5 items so no virtualization needed.
- **Room migration on schema changes** → Define migration paths from v1 upward. The schema is stable (copied from the proven web app) so initial risk is low.
- **Font licensing** → Bebas Neue (OFL), DM Mono (OFL), Inter (OFL) — all open-source, safe to bundle.
- **No data export/import** → Users cannot transfer data from the web app. Acceptable for v1 since the web app is a POC. Could add JSON export later.

## Open Questions

- Should the Android app use the same "SubTracker" name or a differentiated name for the Play Store?
- Minimum Android version: API 26 (Android 8.0) covers ~95% of devices — confirm this is acceptable.
- Should we include a PWA-to-native data migration path in a future version?
