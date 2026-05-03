## ADDED Requirements

### Requirement: User can browse game history
The system SHALL display a list of all games for the active team, sorted by most recent first. Each game card SHALL show opponent name, date, total game time, and status (DONE or IN PROGRESS).

#### Scenario: View game list
- **WHEN** user navigates to the History screen
- **THEN** all games for the active team are displayed with opponent, date, elapsed time, and status badge

#### Scenario: No games
- **WHEN** the active team has no games
- **THEN** the system displays an empty state message "No games yet — start a new one!"

### Requirement: User can view game detail
The system SHALL allow the user to tap a game card to view its detail. The detail view SHALL show: date, total game time, player stats (sorted by court time descending with jersey number, name, court time in MM:SS, percentage of game played, and starter indicator), and a merged event log (substitutions, clock events, period changes) in chronological order.

#### Scenario: View completed game detail
- **WHEN** user taps a completed game
- **THEN** the detail screen shows player stats and the full event log

#### Scenario: Player stats display
- **WHEN** viewing game detail
- **THEN** each player row shows #number, name, STARTER label (if applicable), court time, and percentage of total game time

#### Scenario: Event log display
- **WHEN** viewing game detail with substitutions and clock events
- **THEN** events are merged and sorted chronologically, showing period label, game time, and event description

### Requirement: User can resume an in-progress game
The system SHALL allow the user to resume a game that is not finished. Resuming SHALL reconstruct the on-court/bench state by replaying starters and substitution history, load existing court times, and navigate to the live game screen.

#### Scenario: Resume from history
- **WHEN** user taps Resume on an in-progress game in the detail view
- **THEN** the system reconstructs player court/bench positions and navigates to the live game screen

#### Scenario: Resume from home screen
- **WHEN** the home screen shows an in-progress game card and user taps it
- **THEN** the system resumes the game directly

### Requirement: User can delete a game
The system SHALL allow the user to delete a game and all associated data (substitutions, game_events, game_players). A confirmation dialog SHALL be shown before deletion.

#### Scenario: Delete game with confirmation
- **WHEN** user taps Delete on a game detail and confirms
- **THEN** the game and all associated records are removed, and the user returns to the game list

#### Scenario: Cancel game deletion
- **WHEN** user taps Delete and cancels the confirmation
- **THEN** the game remains unchanged

### Requirement: Home screen shows in-progress and recent games
The home screen SHALL display an "In Progress" section listing unfinished games (with a "Resume" action) and a "Recent Games" section showing the 5 most recent completed games. If no games exist, an empty state with illustration and prompt SHALL be shown.

#### Scenario: In-progress games on home
- **WHEN** the active team has 2 unfinished games
- **THEN** the home screen shows both under "In Progress" with opponent, date, elapsed time, and a "RESUME →" badge

#### Scenario: Recent completed games on home
- **WHEN** the active team has completed games
- **THEN** the home screen shows up to 5 most recent under "Recent Games" with a "DONE" badge

#### Scenario: Empty home screen
- **WHEN** the active team has no games at all
- **THEN** the home screen shows an empty state illustration and "No games yet — start your first one"
