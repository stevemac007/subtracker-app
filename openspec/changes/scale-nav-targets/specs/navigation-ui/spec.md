## ADDED Requirements

### Requirement: Standardized Touch Targets
The system SHALL ensure that all primary navigation and control buttons (utility buttons) have a minimum hit area of 36px in height to ensure reliable interaction on mobile devices.

#### Scenario: Header Button Height
- **WHEN** the application renders the top navigation header
- **THEN** buttons with the `.hbtn` class MUST measure at least 36px in total height, including padding and borders.

#### Scenario: Quarter Button Height
- **WHEN** the application renders the game clock control bar
- **THEN** buttons with the `.qbtn` class MUST measure at least 36px in total height.

### Requirement: Legible Utility Labels
The system SHALL use a minimum font size of 13px for all utility and navigation button labels to improve legibility on high-density mobile screens.

#### Scenario: Utility Label Legibility
- **WHEN** a user views buttons for "ROSTER", "HISTORY", or "LOG"
- **THEN** the text MUST be rendered with a font size of at least 13px.

### Requirement: Balanced Header Layout
The system SHALL maintain a minimum of 10px vertical padding in the application header and 8px in the clock bar to prevent visual crowding when using scaled-up controls.

#### Scenario: Header Spacing
- **WHEN** the main application header is rendered
- **THEN** there MUST be at least 10px of vertical padding between the header container borders and the navigation buttons.
