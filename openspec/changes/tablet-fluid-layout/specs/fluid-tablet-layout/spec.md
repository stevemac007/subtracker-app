## ADDED Requirements

### Requirement: Maximum Container Width
The application SHALL support a maximum viewport width of 1000px to accommodate tablet devices.

#### Scenario: Tablet Viewport
- **WHEN** the browser window width is 1024px
- **THEN** the application container MUST measure exactly 1000px wide and be centered on the screen.

### Requirement: Responsive Background Asset
The court background image SHALL scale proportionally to match the current width of the application container.

#### Scenario: Background Scaling
- **WHEN** the application width changes from 375px to 800px
- **THEN** the `court-bg.svg` background image MUST scale to span the entire 800px width.

### Requirement: Layout Centering
The application SHALL remain centered within the browser window on viewports larger than 1000px.

#### Scenario: Large Monitor View
- **WHEN** the browser window width is 1920px
- **THEN** the application container MUST have equal left and right margins (`margin: 0 auto`).
