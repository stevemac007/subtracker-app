## ADDED Requirements

### Requirement: User can create a team
The system SHALL allow the user to create a new team by providing a team name. The system SHALL reject empty or whitespace-only names. A default team named "My Team" SHALL be created on first app launch if no teams exist.

#### Scenario: Create team with valid name
- **WHEN** user enters a non-empty team name and confirms
- **THEN** system creates the team and sets it as the active team

#### Scenario: Reject empty team name
- **WHEN** user attempts to create a team with an empty or whitespace-only name
- **THEN** system displays an error and does not create the team

#### Scenario: Default team on first launch
- **WHEN** the app launches for the first time with no existing teams
- **THEN** system creates a default team named "My Team" and sets it as active

### Requirement: User can switch active team
The system SHALL allow the user to switch between teams via a team selector accessible from the home screen header. The active team selection SHALL persist across app restarts.

#### Scenario: Switch active team
- **WHEN** user opens the team selector and taps a different team
- **THEN** system sets that team as active and the home screen displays that team's data

#### Scenario: Active team persists across restarts
- **WHEN** user selects a team and restarts the app
- **THEN** the previously selected team is still active

### Requirement: User can rename a team
The system SHALL allow the user to rename the active team from the roster screen. The name change SHALL persist when the user taps Save.

#### Scenario: Rename team
- **WHEN** user changes the team name on the roster screen and taps Save
- **THEN** the team name is updated and reflected in the header and team selector

### Requirement: User can delete a team
The system SHALL allow the user to delete a team, which CASCADE deletes all associated players, games, game_players, substitutions, and game_events. The system SHALL NOT allow deletion of the last remaining team — if the deleted team was the only one, a new default team SHALL be created.

#### Scenario: Delete team with other teams remaining
- **WHEN** user deletes a team and at least one other team exists
- **THEN** system removes the team and all associated data, and switches to the first remaining team

#### Scenario: Delete the only team
- **WHEN** user deletes the only existing team
- **THEN** system removes the team data, creates a new default "My Team", and sets it as active

#### Scenario: Confirm before deletion
- **WHEN** user taps Delete Team
- **THEN** system shows a confirmation dialog before proceeding
