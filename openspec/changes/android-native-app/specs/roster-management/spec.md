## ADDED Requirements

### Requirement: User can add a player to the roster
The system SHALL allow the user to add a player with a name and optional jersey number (up to 3 numeric digits) to the active team's roster. The name field is required; the number field is optional.

#### Scenario: Add player with name and number
- **WHEN** user enters a player name and jersey number and taps Add
- **THEN** system creates the player as active on the current team's roster

#### Scenario: Add player with name only
- **WHEN** user enters a player name with no jersey number and taps Add
- **THEN** system creates the player with an empty jersey number

#### Scenario: Reject empty player name
- **WHEN** user attempts to add a player with an empty or whitespace-only name
- **THEN** the Add button is disabled and no player is created

### Requirement: User can edit a player's name and number
The system SHALL allow inline editing of a player's name and jersey number from the roster screen. Changes SHALL persist immediately on edit.

#### Scenario: Edit player name
- **WHEN** user modifies a player's name field on the roster screen
- **THEN** the updated name is saved immediately

#### Scenario: Edit jersey number
- **WHEN** user modifies a player's jersey number
- **THEN** the system accepts only numeric input (up to 3 digits) and saves immediately

### Requirement: User can toggle a player active or inactive
The system SHALL allow the user to toggle a player between active and inactive status. Inactive players SHALL NOT appear in game setup squad selection. Inactive players SHALL appear dimmed in the roster list.

#### Scenario: Deactivate a player
- **WHEN** user taps the active toggle on an active player
- **THEN** the player is marked inactive and appears dimmed

#### Scenario: Reactivate a player
- **WHEN** user taps the active toggle on an inactive player
- **THEN** the player is marked active and appears at full opacity

### Requirement: User can delete a player
The system SHALL allow the user to permanently delete a player from the roster. Past game stats for that player SHALL be preserved. The system SHALL show a confirmation dialog before deletion.

#### Scenario: Delete player with confirmation
- **WHEN** user taps the delete button on a player and confirms
- **THEN** the player is removed from the roster but their historical game data remains

#### Scenario: Cancel player deletion
- **WHEN** user taps the delete button and cancels the confirmation
- **THEN** the player remains on the roster

### Requirement: Roster displays active player count
The system SHALL display the count of active players in the roster section header.

#### Scenario: Active count shown
- **WHEN** user views the roster screen
- **THEN** the section header shows the number of active players (e.g., "8 active")
