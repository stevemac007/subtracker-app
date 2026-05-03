## ADDED Requirements

### Requirement: User can set opponent name
The system SHALL allow the user to enter an opponent name. The default value SHALL be "Opponent". If left empty, the system SHALL use "Opponent" as the name.

#### Scenario: Set custom opponent name
- **WHEN** user enters "Eagles" as the opponent name
- **THEN** the game is created with opponent "Eagles"

#### Scenario: Default opponent name
- **WHEN** user leaves the opponent field empty and starts the game
- **THEN** the game is created with opponent "Opponent"

### Requirement: User can select period format
The system SHALL allow the user to choose between "Quarters" (Q1–Q4 + OT) and "Halves" (H1–H2 + OT). The default SHALL be "Quarters". Selecting a format SHALL update the default period duration.

#### Scenario: Select quarters format
- **WHEN** user selects Quarters
- **THEN** the game uses Q1, Q2, Q3, Q4, and OT periods with default 10-minute period duration

#### Scenario: Select halves format
- **WHEN** user selects Halves
- **THEN** the game uses H1, H2, and OT periods with default 17-minute period duration

### Requirement: User can select clock direction
The system SHALL allow the user to choose between "Count Up" (from 0:00) and "Count Down" (from period duration). The default SHALL be "Count Up".

#### Scenario: Select count up
- **WHEN** user selects Count Up
- **THEN** the game clock counts from 0:00 upward and no period duration input is shown

#### Scenario: Select count down
- **WHEN** user selects Count Down
- **THEN** the system shows a period duration selector and the clock counts down from that value

### Requirement: User can set period duration for countdown clock
The system SHALL allow the user to set period duration in minutes (1–30) when clock direction is "Count Down". The value SHALL be adjustable via increment/decrement buttons.

#### Scenario: Adjust period duration
- **WHEN** user taps increment to set duration to 12 minutes
- **THEN** the period duration is set to 12 minutes (720 seconds)

#### Scenario: Duration bounds
- **WHEN** user attempts to decrement below 1 or increment above 30
- **THEN** the value stays at the minimum (1) or maximum (30)

### Requirement: User can select squad from active roster
The system SHALL display all active players for the current team. The user SHALL be able to toggle players in/out of the game squad. The maximum squad size SHALL be 12 players. The first 12 active players SHALL be pre-selected by default.

#### Scenario: Toggle player into squad
- **WHEN** user taps a player who is OUT and squad size is below 12
- **THEN** the player is added to the squad

#### Scenario: Toggle player out of squad
- **WHEN** user taps a player who is IN
- **THEN** the player is removed from the squad and from starters if they were a starter

#### Scenario: Squad limit reached
- **WHEN** user attempts to add a 13th player to the squad
- **THEN** the system does not add the player (squad stays at 12)

### Requirement: User can select exactly 5 starters
The system SHALL allow the user to designate exactly 5 starters from the active squad. Only players in the squad can be selected as starters. The first 5 active players SHALL be pre-selected as starters by default.

#### Scenario: Select a starter
- **WHEN** user taps BENCH on a squad player and fewer than 5 starters are selected
- **THEN** the player is marked as a starter

#### Scenario: Starter limit reached
- **WHEN** user attempts to select a 6th starter
- **THEN** the system does not add the starter (stays at 5)

#### Scenario: Deselect a starter
- **WHEN** user taps START on a starter
- **THEN** the player is moved back to bench status

### Requirement: Game can only start with valid squad
The system SHALL enable the "Tip Off" button only when at least 5 players are in the squad AND exactly 5 starters are selected. The screen SHALL display current counts (X/12 active, Y/5 starters).

#### Scenario: Valid squad — start enabled
- **WHEN** squad has 8 players and 5 starters selected
- **THEN** the Tip Off button is enabled

#### Scenario: Invalid squad — start disabled
- **WHEN** squad has 4 players or fewer than 5 starters
- **THEN** the Tip Off button is disabled

### Requirement: Starting a game creates database records
The system SHALL create a `games` row with opponent, date, period_type, clock_direction, period_duration_sec, and team_id. The system SHALL create `game_players` rows for each squad member with is_starter flag. The system SHALL navigate to the live game screen.

#### Scenario: Game creation
- **WHEN** user taps Tip Off with a valid squad
- **THEN** system creates the game and game_players records and navigates to the live game screen with starters on court
