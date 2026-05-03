## Why

Navigation buttons in the header and clock bar are currently too small for reliable touch interaction on mobile devices (tap targets are ~26px high). This leads to "fat finger" errors and user frustration when trying to switch screens or manage the game clock during live action.

## What Changes

- **Touch Target Scaling**: Increase the minimum height of all navigation buttons (`.hbtn`, `.qbtn`, `.tog`) to at least 36px-40px to meet modern mobile accessibility standards.
- **Typography Refresh**: Bump the font size for utility buttons from 11px to 13px-14px for better legibility on high-density screens.
- **Header Layout Adjustments**: Increase vertical padding in the header (`.hdr`) and clock bar (`.clock-bar`) to maintain visual balance with the larger controls.
- **Sort Toggle Refinement**: Update the vertical "GAME/STINT" toggle in the Game Screen to ensure it remains accessible without crowding the clock display.

## Capabilities

### New Capabilities
- `navigation-ui`: Defines standardized touch target sizes, typography, and hit areas for primary navigation and control elements to ensure mobile accessibility.

### Modified Capabilities

## Impact

- **GlobalStyles.jsx**: Centralized update to `.hbtn`, `.qbtn`, `.hdr`, and `.clock-bar` styles.
- **GameScreen.jsx**: Layout validation for the clock bar and player grid with larger control elements.
- **HomeScreen.jsx / RosterScreen.jsx / NewGameScreen.jsx**: Scaling of "Back" and primary action buttons.
