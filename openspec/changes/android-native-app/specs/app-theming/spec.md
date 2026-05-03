## ADDED Requirements

### Requirement: Four color themes available
The system SHALL provide four themes: Scoreboard (dark amber/green, default), Midnight (dark blue/cyan), Chalk (light warm), and High Contrast (black/white with vivid accents). Each theme SHALL define colors for: background, surface, primary accent, secondary accent, success (green), error (red), info (blue), text primary, text secondary, and text muted.

#### Scenario: Default theme
- **WHEN** the app launches for the first time
- **THEN** the Scoreboard theme is applied

#### Scenario: Theme colors applied
- **WHEN** the Scoreboard theme is active
- **THEN** the background is dark (#131009), primary accent is amber (#f5a623), success is green (#22c55e), and text is warm (#ede0cc)

### Requirement: User can switch themes
The system SHALL provide a theme chooser accessible from the home screen header (palette icon). The chooser SHALL display all themes with color swatches and the theme name. Tapping a theme SHALL apply it immediately.

#### Scenario: Open theme chooser
- **WHEN** user taps the palette icon in the header
- **THEN** a modal displays all four themes with color preview swatches

#### Scenario: Switch theme
- **WHEN** user taps the Midnight theme in the chooser
- **THEN** the app immediately applies the Midnight color scheme and closes the chooser

### Requirement: Theme selection persists
The system SHALL persist the selected theme in DataStore Preferences. The theme SHALL be restored on app restart.

#### Scenario: Theme persists across restarts
- **WHEN** user selects Chalk theme and restarts the app
- **THEN** the Chalk theme is applied on launch

### Requirement: Custom typography
The system SHALL use three font families matching the web app: Bebas Neue for headings, labels, and buttons; DM Mono for clock displays, timestamps, and monospace data; Inter for body text. Fonts SHALL be bundled as app resources (no network dependency).

#### Scenario: Typography applied
- **WHEN** viewing the game clock
- **THEN** the clock digits use DM Mono, the period buttons use Bebas Neue, and any body text uses Inter
