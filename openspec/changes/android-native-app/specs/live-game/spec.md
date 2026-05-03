## ADDED Requirements

### Requirement: Game clock with start, pause, and zero controls
The system SHALL display a game clock showing elapsed time (count up) or remaining time (count down). The clock SHALL have Start, Pause, and Zero controls. Clock precision SHALL use wall-clock deltas to ensure accuracy regardless of frame timing. The clock display SHALL use MM:SS format.

#### Scenario: Start clock
- **WHEN** user taps Start
- **THEN** the clock begins running, the button changes to Pause, court players begin accumulating court time, and a clock_start event is logged

#### Scenario: Pause clock
- **WHEN** user taps Pause while clock is running
- **THEN** the clock stops, court time accumulation pauses for all on-court players, elapsed time is persisted to the database, and a clock_pause event is logged

#### Scenario: Zero clock
- **WHEN** user taps Zero
- **THEN** the clock pauses (if running) and resets the game clock display to 00:00 (count up) or the period duration (count down). Period accumulated time resets.

#### Scenario: Count down reaches zero
- **WHEN** clock direction is "down" and the period clock reaches 00:00
- **THEN** the clock displays 00:00 and does not go negative

### Requirement: Period tracking with quarter/half navigation
The system SHALL display period buttons matching the game format (Q1–Q4+OT for quarters, H1–H2+OT for halves). The user SHALL be able to switch periods at any time. Switching periods SHALL pause the clock and reset the period timer. A quarter_change event SHALL be logged.

#### Scenario: Change period
- **WHEN** user taps Q2 while in Q1
- **THEN** the clock pauses, period timer resets, Q2 is highlighted as active, and a quarter_change event is logged with detail "Q2"

#### Scenario: Period indicator
- **WHEN** user views the clock bar
- **THEN** the current period label and running state (LIVE/STOPPED) are displayed

### Requirement: Court and bench display with player cards
The system SHALL display two columns: "On Court" (green indicator) and "Bench" (blue indicator). Each player card SHALL show jersey number, name (auto-scaled to fit), total court time (MM:SS), and current stint time. On-court players show an up-arrow stint indicator; bench players show a down-arrow stint indicator.

#### Scenario: Court display
- **WHEN** game is active with 5 on court and 3 on bench
- **THEN** the On Court column shows 5 player cards with green indicators and the Bench column shows 3 player cards with blue indicators

#### Scenario: Court time updates in real-time
- **WHEN** the clock is running
- **THEN** on-court players' court time and stint time increment in real-time (≈60fps updates)

### Requirement: Player sort mode toggle
The system SHALL support two sort modes: "Game" (sort by total court time descending) and "Stint" (sort by current stint time descending). The user SHALL toggle between modes via a button on the clock bar.

#### Scenario: Toggle sort mode
- **WHEN** user taps the sort toggle showing "GAME"
- **THEN** the toggle switches to "STINT" and players are re-sorted by current stint time

### Requirement: Tap-to-substitute with multi-swap support
The system SHALL allow the user to select one or more on-court players (marked for OUT) and one or more bench players (marked for IN). Selections SHALL be visually highlighted (red for OUT, green for IN). The substitution panel SHALL appear when any player is selected.

#### Scenario: Select player for substitution out
- **WHEN** user taps an on-court player
- **THEN** the player card highlights red and shows an "OUT" badge

#### Scenario: Select player for substitution in
- **WHEN** user taps a bench player
- **THEN** the player card highlights green and shows an "IN" badge

#### Scenario: Deselect a player
- **WHEN** user taps an already-selected player
- **THEN** the selection is removed

### Requirement: Substitution confirmation with even pairing
The system SHALL pair OUT and IN selections in order. The Confirm button SHALL only be enabled when the number of OUT selections equals the number of IN selections (no uneven swaps). Uneven selections SHALL display a warning.

#### Scenario: Confirm even substitution
- **WHEN** user selects 2 players OUT and 2 players IN and taps Confirm
- **THEN** the system swaps the paired players, records substitution rows in the database, updates court times, resets stint timers for swapped players, and clears the selection

#### Scenario: Uneven selection warning
- **WHEN** user selects 2 players OUT and 1 player IN
- **THEN** the substitution panel shows "UNEVEN" warning and the Confirm button is disabled

#### Scenario: Cancel substitution
- **WHEN** user taps Cancel in the substitution panel
- **THEN** all selections are cleared and the panel disappears

### Requirement: Substitution records court time correctly
When a substitution is confirmed, the system SHALL bank the outgoing player's accumulated court time (stint start to now), stop their court time accumulation, start the incoming player's court time accumulation (if clock is running), and reset both players' stint timers.

#### Scenario: Court time banking on sub out
- **WHEN** player A has been on court for 3:00 and is substituted out
- **THEN** player A's court_ms is updated to include the 3:00 stint, and their stint timer resets

#### Scenario: Incoming player starts accumulating
- **WHEN** player B is substituted in while the clock is running
- **THEN** player B's court time begins accumulating from their current banked total and their stint timer starts at 0:00

### Requirement: Player stats overlay
The system SHALL provide a Stats modal showing all players sorted by court time descending. Each row SHALL display jersey number, name, court time (MM:SS), percentage of total game time, and a "LIVE" indicator for on-court players.

#### Scenario: View stats
- **WHEN** user taps the STATS button
- **THEN** a modal overlay displays all players with their court time and game percentage

#### Scenario: Live indicator
- **WHEN** a player is currently on court
- **THEN** their stats row shows a green "LIVE" indicator

### Requirement: Game event log
The system SHALL maintain a chronological log of all events: substitutions (player out → player in), clock starts, clock pauses, and period changes. The log SHALL be viewable via a LOG modal. Events SHALL include the period label and game time.

#### Scenario: View game log
- **WHEN** user taps the LOG button
- **THEN** a modal displays all events in reverse chronological order with period and time stamps

#### Scenario: Substitution log entry
- **WHEN** a substitution is confirmed at Q2 05:30
- **THEN** the log shows "Q2 05:30 PlayerOut → PlayerIn"

### Requirement: End game
The system SHALL allow the user to end the game via an END button. Ending the game SHALL pause the clock, persist all final court times, mark the game as finished, and navigate back to the home screen.

#### Scenario: End game
- **WHEN** user taps END
- **THEN** the clock pauses, all player court times are saved, the game is marked finished=1, and the user returns to the home screen

### Requirement: Screen stays awake during live game
The system SHALL keep the screen on while the live game screen is active using the Android FLAG_KEEP_SCREEN_ON window flag. The flag SHALL be released when leaving the game screen.

#### Scenario: Screen wake lock
- **WHEN** user is on the live game screen
- **THEN** the device screen does not turn off due to inactivity

#### Scenario: Wake lock released
- **WHEN** user navigates away from the live game screen
- **THEN** the screen wake lock is released and normal timeout behavior resumes
