# Requirements Document

## Introduction

SubTracker currently supports a single implicit team — all players belong to one roster and one team name. This feature introduces multi-team support so a coach or scorekeeper who works with multiple teams (e.g., varsity and JV, or a rec-league coordinator) can maintain separate rosters and track games per team.

## Glossary

- **App**: The SubTracker single-page application running in the browser
- **Team_Selector**: The UI component that allows the user to choose which team is active
- **Team**: A named entity that owns a roster of players and a collection of games
- **Active_Team**: The team currently selected for viewing and managing in the App
- **Roster_Screen**: The screen where players are added, edited, and deactivated for a team
- **Home_Screen**: The main landing screen showing the active team name, in-progress games, and recent games
- **New_Game_Screen**: The screen where the user configures opponent, squad, and starters before starting a game
- **History_Screen**: The screen listing past and in-progress games for review
- **Database**: The sql.js SQLite database persisted as base64 in localStorage

## Requirements

### Requirement 1: Team Creation

**User Story:** As a coach, I want to create new teams, so that I can manage separate rosters for each team I coach.

#### Acceptance Criteria

1. WHEN the user taps the "Add Team" action, THE App SHALL display a form to enter a team name
2. WHEN the user submits a non-empty team name, THE App SHALL create a new Team in the Database with that name
3. WHEN a new Team is created, THE App SHALL set the new Team as the Active_Team
4. IF the user submits an empty team name, THEN THE App SHALL prevent creation and display a validation message

### Requirement 2: Team Selection

**User Story:** As a coach, I want to switch between my teams, so that I can manage rosters and games for each team independently.

#### Acceptance Criteria

1. THE Home_Screen SHALL display the name of the Active_Team in the header
2. WHEN the user taps the team name or Team_Selector, THE App SHALL display a list of all teams
3. WHEN the user selects a team from the list, THE App SHALL set that team as the Active_Team
4. WHEN the Active_Team changes, THE Home_Screen SHALL display only games belonging to the Active_Team
5. THE App SHALL persist the last selected Active_Team across browser sessions

### Requirement 3: Team-Scoped Roster

**User Story:** As a coach, I want each team to have its own roster, so that players on one team do not appear on another team's roster.

#### Acceptance Criteria

1. THE Roster_Screen SHALL display only players belonging to the Active_Team
2. WHEN the user adds a player on the Roster_Screen, THE App SHALL associate that player with the Active_Team
3. WHEN the user edits a player name or number, THE Roster_Screen SHALL update only that player record in the Active_Team roster
4. THE Roster_Screen SHALL display the Active_Team name as the editable team name field

### Requirement 4: Team-Scoped Games

**User Story:** As a coach, I want games to belong to a specific team, so that game history and stats stay organized per team.

#### Acceptance Criteria

1. WHEN the user starts a new game, THE New_Game_Screen SHALL associate the game with the Active_Team
2. THE New_Game_Screen SHALL display only players from the Active_Team roster for squad selection
3. THE Home_Screen SHALL display in-progress and recent games only for the Active_Team
4. THE History_Screen SHALL display only games belonging to the Active_Team

### Requirement 5: Team Renaming

**User Story:** As a coach, I want to rename a team, so that I can correct or update the team name at any time.

#### Acceptance Criteria

1. WHEN the user edits the team name field on the Roster_Screen and saves, THE App SHALL update the Active_Team name in the Database
2. WHEN the team name is updated, THE Home_Screen SHALL reflect the new name upon returning

### Requirement 6: Team Deletion

**User Story:** As a coach, I want to delete a team I no longer need, so that the team list stays clean and relevant.

#### Acceptance Criteria

1. WHEN the user requests deletion of a team, THE App SHALL prompt for confirmation before proceeding
2. WHEN the user confirms deletion, THE App SHALL remove the team, its roster, and all associated games from the Database
3. IF the deleted team was the Active_Team, THEN THE App SHALL set another existing team as the Active_Team
4. IF no teams remain after deletion, THEN THE App SHALL create a default team named "My Team" and set it as the Active_Team
5. WHILE only one team exists, THE App SHALL disable the delete action for that team

### Requirement 7: Team-Scoped Player Deactivation

**User Story:** As a coach, I want to deactivate or reactivate players within a specific team, so that inactive players do not appear in squad selection but their historical data is preserved.

#### Acceptance Criteria

1. WHEN the user toggles a player's active status on the Roster_Screen, THE App SHALL update only that player's status within the Active_Team
2. THE New_Game_Screen SHALL display only active players from the Active_Team for squad selection
