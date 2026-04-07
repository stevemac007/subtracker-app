# Implementation Plan: Multi-Team Rosters

## Overview

Add multi-team support to SubTracker so a coach can maintain separate rosters and game histories per team. The implementation threads `activeTeamId` through the component tree, adds `team_id` columns to `players` and `games`, introduces a TeamSelector dropdown, and scopes all queries to the active team. Since there are no existing users, the schema is updated in place with no migration needed.

## Tasks

- [ ] 1. Update database schema and helpers
  - [ ] 1.1 Add `team_id` column to `players` and `games` tables in `applySchema()` in `src/db.js`
    - Update `CREATE TABLE IF NOT EXISTS players` to include `team_id INTEGER NOT NULL DEFAULT 1 REFERENCES team(id)`
    - Update `CREATE TABLE IF NOT EXISTS games` to include `team_id INTEGER NOT NULL DEFAULT 1 REFERENCES team(id)`
    - Add `ALTER TABLE players ADD COLUMN team_id ...` and `ALTER TABLE games ADD COLUMN team_id ...` wrapped in try/catch for idempotency
    - Remove the hardcoded `INSERT OR IGNORE INTO team (id, name) VALUES (1, 'My Team')` and replace with a conditional insert that only seeds if the team table is empty
    - _Requirements: 1.2, 3.2, 4.1_

  - [ ] 1.2 Add team CRUD helper functions in `src/db.js`
    - `createTeam(db, name)` — inserts a new team row, returns the new team ID
    - `deleteTeam(db, teamId)` — cascade deletes team, its players, their game_players rows, games, substitutions, and game_events in correct order
    - `getTeams(db)` — returns all teams ordered by ID
    - `getActiveTeamId()` — reads from localStorage key `subtracker_active_team`, validates it exists in DB, falls back to first team
    - `setActiveTeamId(id)` — writes to localStorage key `subtracker_active_team`
    - _Requirements: 1.2, 2.5, 6.2, 6.3, 6.4_

  - [ ]* 1.3 Write property tests for team creation round-trip (Property 1)
    - **Property 1: Team creation round-trip**
    - For any non-empty, non-whitespace-only team name, creating a team results in a row with that exact name
    - **Validates: Requirements 1.2, 1.3**

  - [ ]* 1.4 Write property test for whitespace team name rejection (Property 2)
    - **Property 2: Whitespace team names are rejected**
    - For any whitespace-only string, team creation is rejected and team count is unchanged
    - **Validates: Requirements 1.4**

  - [ ]* 1.5 Write property test for active team persistence round-trip (Property 3)
    - **Property 3: Active team selection persistence round-trip**
    - For any team ID, writing to localStorage and reading back returns the same ID
    - **Validates: Requirements 2.3, 2.5**

- [ ] 2. Checkpoint — Ensure schema and helpers are correct
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Thread `activeTeamId` through App and create TeamSelector
  - [ ] 3.1 Update `App.jsx` to manage `activeTeamId` state
    - Add `activeTeamId` state initialized from `getActiveTeamId()` after DB loads
    - Create `setActiveTeam(id)` callback that updates state and calls `setActiveTeamId(id)`
    - Pass `activeTeamId` as a prop to HomeScreen, RosterScreen, NewGameScreen, HistoryScreen
    - _Requirements: 2.3, 2.5_

  - [ ] 3.2 Create `TeamSelector` component in `src/TeamSelector.jsx`
    - Dropdown overlay listing all teams from `getTeams(db)`
    - Highlight the active team
    - Inline "Add Team" row with text input and validation (non-empty, non-whitespace)
    - Show validation message for empty/whitespace names
    - Call `onSelect(teamId)` when a team is picked
    - Call `onTeamCreated(teamId)` after a new team is created (which also sets it as active)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.2, 2.3_

- [ ] 4. Update HomeScreen for team scoping and team selector
  - [ ] 4.1 Modify `HomeScreen.jsx` to scope queries and show team selector
    - Accept `activeTeamId` and `onTeamChange` props
    - Make team name header tappable to open TeamSelector
    - Query in-progress games: `WHERE team_id = ? AND finished = 0`
    - Query recent games: `WHERE team_id = ? AND finished = 1`
    - Display active team name from `SELECT name FROM team WHERE id = ?`
    - _Requirements: 2.1, 2.4, 4.3_

  - [ ]* 4.2 Write property test for games scoped to active team (Property 4)
    - **Property 4: Games are scoped to the active team**
    - For N teams with M games each, querying by team_id returns only that team's games
    - **Validates: Requirements 2.4, 4.3, 4.4**

- [ ] 5. Update RosterScreen for team scoping, renaming, and deletion
  - [ ] 5.1 Modify `RosterScreen.jsx` to scope to active team
    - Accept `activeTeamId` prop
    - Query team name: `SELECT name FROM team WHERE id = ?` parameterized by `activeTeamId`
    - Query players: `SELECT * FROM players WHERE team_id = ? ORDER BY id`
    - Add player: `INSERT INTO players (name, number, active, team_id) VALUES (?, ?, 1, ?)`
    - Save team name: `UPDATE team SET name = ? WHERE id = ?`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1_

  - [ ] 5.2 Add team deletion UI to `RosterScreen.jsx`
    - Add a "Delete Team" button, disabled when only one team exists
    - Show confirmation dialog before deletion
    - Call `deleteTeam(db, activeTeamId)` on confirm
    - After deletion, if no teams remain, create default "My Team" and set as active
    - Otherwise set another existing team as active
    - Notify parent (via callback prop) to update `activeTeamId`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 5.3 Write property test for players scoped to active team (Property 5)
    - **Property 5: Players are scoped to the active team**
    - For N teams with random players, querying by team_id returns only that team's players
    - **Validates: Requirements 3.1, 4.2, 7.2**

  - [ ]* 5.4 Write property test for new player association (Property 6)
    - **Property 6: New player is associated with the active team**
    - Adding a player with a given team_id results in that player appearing only in that team's roster
    - **Validates: Requirements 3.2**

  - [ ]* 5.5 Write property test for player edit isolation (Property 8)
    - **Property 8: Player edits are isolated to the target player and team**
    - Editing one player leaves all other players unchanged
    - **Validates: Requirements 3.3, 7.1**

  - [ ]* 5.6 Write property test for team rename round-trip (Property 9)
    - **Property 9: Team rename round-trip**
    - Updating a team name and querying back returns the new name
    - **Validates: Requirements 5.1, 5.2**

- [ ] 6. Checkpoint — Ensure roster and home screen work with multi-team
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Update NewGameScreen and HistoryScreen for team scoping
  - [ ] 7.1 Modify `NewGameScreen.jsx` to scope to active team
    - Accept `activeTeamId` prop
    - Query players: `WHERE active = 1 AND team_id = ?`
    - Insert game with `team_id`: `INSERT INTO games (opponent, date, finished, total_secs, team_id) VALUES (?, ?, 0, 0, ?)`
    - Display team name from active team query
    - _Requirements: 4.1, 4.2, 7.2_

  - [ ] 7.2 Modify `HistoryScreen.jsx` to scope to active team
    - Accept `activeTeamId` prop
    - Query games: `WHERE team_id = ? ORDER BY id DESC`
    - _Requirements: 4.4_

  - [ ]* 7.3 Write property test for new game association (Property 7)
    - **Property 7: New game is associated with the active team**
    - Creating a game with a given team_id results in that game appearing only in that team's listing
    - **Validates: Requirements 4.1**

  - [ ]* 7.4 Write property test for cascade delete (Property 10)
    - **Property 10: Cascade delete removes team and all children**
    - Deleting a team removes all players, games, game_players, substitutions, and game_events for that team
    - **Validates: Requirements 6.2**

  - [ ]* 7.5 Write property test for active team fallback after deletion (Property 11)
    - **Property 11: Deleting the active team falls back to another team**
    - When the active team is deleted, the new active team references an existing team
    - **Validates: Requirements 6.3**

- [ ] 8. Update Playwright E2E test helpers for multi-team support
  - [ ] 8.1 Update `tests/helpers.js` with team-aware helper functions
    - Add `givenTeamCreated(page, teamName)` helper
    - Add `givenTeamSelected(page, teamName)` helper
    - Update `givenRosterCreated` to work with the active team context
    - Ensure existing tests still pass with the default "My Team" team
    - _Requirements: 1.1, 1.2, 2.2, 2.3_

- [ ] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use `fast-check` and test the DB logic directly (no UI)
- Property test file: `subtime-app/tests/multi-team-properties.test.js`
- GameScreen requires no changes — it's already scoped by `gameId`
- No data migration needed since there are no existing users
- Checkpoints ensure incremental validation
