## 1. Project Setup

- [ ] 1.1 Create new Android project with Kotlin + Jetpack Compose (minSdk 26, targetSdk 35)
- [ ] 1.2 Add dependencies: Room, Navigation Compose, Material 3, DataStore Preferences, Kotlin Coroutines
- [ ] 1.3 Set up package structure: data/, ui/ (home, roster, history, gamesetup, game, theme, components), navigation/, util/
- [ ] 1.4 Bundle font resources: Bebas Neue, DM Mono, Inter (OFL-licensed TTF files)

## 2. Database Layer (local-database spec)

- [ ] 2.1 Define Room entities: Team, Player, Game, GamePlayer, Substitution, GameEvent — matching web app schema
- [ ] 2.2 Define Room DAOs: TeamDao, PlayerDao, GameDao, GamePlayerDao, SubstitutionDao, GameEventDao with Flow queries and suspend writes
- [ ] 2.3 Create AppDatabase (RoomDatabase) with version 1, all entities, and onCreate callback to seed default team
- [ ] 2.4 Implement cascade delete for teams (delete players, games, game_players, substitutions, game_events by team_id)
- [ ] 2.5 Write instrumented tests for DAOs: insert, query, cascade delete, reactive Flow emission

## 3. Theme System (app-theming spec)

- [ ] 3.1 Define four ColorScheme objects: Scoreboard, Midnight, Chalk, HighContrast with all color tokens
- [ ] 3.2 Define custom Typography using bundled Bebas Neue, DM Mono, Inter fonts
- [ ] 3.3 Create ThemePreferences (DataStore) to persist selected theme key
- [ ] 3.4 Create SubTrackerTheme composable wrapping MaterialTheme with dynamic color scheme and typography
- [ ] 3.5 Build ThemeChooser dialog composable with color swatches and theme names

## 4. Navigation

- [ ] 4.1 Define sealed class routes: Home, Roster, History, GameSetup, Game(gameId), GameDetail(gameId)
- [ ] 4.2 Create NavHost with composable destinations for each route
- [ ] 4.3 Wire navigation actions (back, forward, resume game with gameId argument)

## 5. Team Management (team-management spec)

- [ ] 5.1 Build TeamSelector dialog composable: list teams, highlight active, add new team input
- [ ] 5.2 Implement active team persistence in DataStore with fallback to first team
- [ ] 5.3 Implement team delete with confirmation dialog and cascade logic
- [ ] 5.4 Implement team rename (save from roster screen)

## 6. Roster Screen (roster-management spec)

- [ ] 6.1 Build RosterScreen composable: team name input, player list, add player form
- [ ] 6.2 Implement add player (name required, optional 3-digit numeric jersey number)
- [ ] 6.3 Implement inline edit for player name and jersey number with immediate persistence
- [ ] 6.4 Implement active/inactive toggle with visual dimming for inactive players
- [ ] 6.5 Implement delete player with confirmation dialog (preserves historical game data)
- [ ] 6.6 Display active player count in section header
- [ ] 6.7 Implement Save button for team name with visual confirmation feedback

## 7. Game Setup Screen (game-setup spec)

- [ ] 7.1 Build NewGameScreen composable: opponent input, period format toggle, clock direction toggle
- [ ] 7.2 Implement period duration selector (1–30 minutes, increment/decrement) shown only for count-down
- [ ] 7.3 Build squad selection list: toggle IN/OUT per player (max 12), toggle BENCH/START (max 5 starters)
- [ ] 7.4 Display squad counts (X/12 active, Y/5 starters) and enable Tip Off only when valid
- [ ] 7.5 Implement game creation: insert games row + game_players rows, navigate to Game(gameId)

## 8. Live Game Screen (live-game spec)

- [ ] 8.1 Create GameViewModel with coroutine-based clock: wall-clock delta timing, start/pause/zero, period tracking
- [ ] 8.2 Implement court time accumulation: stint start/bank pattern, per-player bankedMs tracking
- [ ] 8.3 Build clock bar composable: MM:SS display, period buttons, start/pause/zero controls, period pill
- [ ] 8.4 Build court/bench two-column layout with player cards: jersey number, FitName, court time, stint time, selection badges
- [ ] 8.5 Implement tap-to-substitute: select OUT (on-court) and IN (bench) players with visual highlighting
- [ ] 8.6 Build substitution panel: pair display, uneven warning, confirm/cancel buttons
- [ ] 8.7 Implement substitution confirm: swap players, bank court times, reset stints, insert substitution DB rows
- [ ] 8.8 Implement sort mode toggle (game time vs stint time)
- [ ] 8.9 Build player stats modal: all players sorted by court time, showing MM:SS, percentage, LIVE indicator
- [ ] 8.10 Build game log modal: merged events (subs, clock, period changes) in reverse chronological order
- [ ] 8.11 Implement end game: pause clock, persist final times, mark finished=1, navigate home
- [ ] 8.12 Implement screen wake lock via FLAG_KEEP_SCREEN_ON on game screen, released on exit
- [ ] 8.13 Implement game event logging: clock_start, clock_pause, quarter_change events with game time and period

## 9. Game History Screen (game-history spec)

- [ ] 9.1 Build HistoryScreen composable: game list sorted by most recent, with opponent/date/time/status badge
- [ ] 9.2 Build GameDetailScreen composable: player stats table and merged event log
- [ ] 9.3 Implement resume game: reconstruct on-court/bench state from starters + substitution history
- [ ] 9.4 Implement delete game with confirmation dialog and cascade delete of associated records
- [ ] 9.5 Display empty state when no games exist

## 10. Home Screen (game-history spec — home section)

- [ ] 10.1 Build HomeScreen composable: header with team name/selector, theme chooser, roster/history buttons
- [ ] 10.2 Display in-progress games section with resume action
- [ ] 10.3 Display recent completed games section (up to 5)
- [ ] 10.4 Display empty state with illustration when no games exist
- [ ] 10.5 Wire New Game button to GameSetup navigation

## 11. Shared Components

- [ ] 11.1 Build FitName composable: auto-scale text to fit container width
- [ ] 11.2 Build Loader composable for database initialization state
- [ ] 11.3 Build reusable confirmation dialog composable

## 12. Testing & Polish

- [ ] 12.1 Write unit tests for clock logic: start, pause, zero, wall-clock delta accuracy
- [ ] 12.2 Write unit tests for substitution logic: pairing, court time banking, stint reset
- [ ] 12.3 Write UI tests for critical flows: create game → substitute → end game
- [ ] 12.4 Verify all four themes render correctly across screens
- [ ] 12.5 Test game resume: verify court/bench reconstruction from substitution history
