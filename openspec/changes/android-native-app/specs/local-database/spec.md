## ADDED Requirements

### Requirement: Room database with matching schema
The system SHALL use a Room database with the following tables matching the web app schema: `team` (id, name), `players` (id, name, number, active, team_id), `games` (id, opponent, date, notes, finished, total_secs, team_id, period_type, clock_direction, period_duration_sec), `game_players` (id, game_id, player_id, court_ms, is_starter), `substitutions` (id, game_id, game_time_sec, quarter, player_out_id, player_in_id, created_at), `game_events` (id, game_id, event_type, game_time_sec, quarter, detail, created_at).

#### Scenario: Database created on first launch
- **WHEN** the app launches for the first time
- **THEN** the Room database is created with all tables and a default team seeded

#### Scenario: Schema matches web app
- **WHEN** comparing the Room entities to the web app's SQL schema
- **THEN** all columns, types, defaults, and foreign key relationships match

### Requirement: DAOs provide reactive data access
The system SHALL define Room DAOs that return `Flow<List<T>>` for list queries (enabling reactive UI updates) and suspend functions for write operations. DAOs SHALL cover: team CRUD, player CRUD scoped by team_id, game CRUD scoped by team_id, game_players queries by game_id, substitution inserts and queries by game_id, game_events inserts and queries by game_id.

#### Scenario: Reactive player list
- **WHEN** a player is added to the roster
- **THEN** any active Flow collecting the player list automatically emits the updated list

#### Scenario: Suspend write operations
- **WHEN** a game is created via the DAO
- **THEN** the insert runs on a background thread and returns the new row ID

### Requirement: Cascade delete for teams
The system SHALL cascade delete all associated data when a team is deleted: players, games, game_players (via games), substitutions (via games), and game_events (via games).

#### Scenario: Delete team cascades
- **WHEN** a team with 5 players and 3 games is deleted
- **THEN** all 5 players, 3 games, and all associated game_players, substitutions, and game_events are removed

### Requirement: Database migration support
The system SHALL define the initial database version as 1. Future schema changes SHALL use Room's Migration API with explicit SQL migration steps. Destructive migration SHALL NOT be used.

#### Scenario: Future migration
- **WHEN** a schema change is needed in a future version
- **THEN** a Migration(N, N+1) is defined with the required ALTER TABLE or CREATE TABLE statements

### Requirement: Default team seeding
The system SHALL seed a default team with id=1 and name="My Team" via Room's `RoomDatabase.Callback.onCreate`. This matches the web app's behavior of inserting a default team when the database is first created.

#### Scenario: Seed default team
- **WHEN** the database is created for the first time
- **THEN** a team row with id=1 and name="My Team" exists
