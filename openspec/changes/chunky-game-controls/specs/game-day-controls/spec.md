## ADDED Requirements

### Requirement: High-Impact Clock Controls
The system SHALL provide clock controls (START, ZERO) with a minimum height of 50px to ensure reliable operation during active gameplay.

#### Scenario: Start Button Size
- **WHEN** the live game screen is rendered
- **THEN** the START/PAUSE button MUST measure at least 50px in total height.

### Requirement: Scaled Clock Display
The system SHALL render the game clock digits at a minimum font size of 48px for enhanced visibility.

#### Scenario: Clock Digit Visibility
- **WHEN** the game clock is visible
- **THEN** the digits MUST be at least 48px in size.

### Requirement: Uniform Game Actions
The system SHALL ensure that LOG, STATS, and END buttons in the live game header match the 44px height standard of the primary navigation.

#### Scenario: Header Action Height
- **WHEN** the Game Screen header is rendered
- **THEN** the LOG, STATS, and END buttons MUST measure at least 44px in height.
