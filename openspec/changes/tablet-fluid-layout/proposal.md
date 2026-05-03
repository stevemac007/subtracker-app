## Why

The current fixed 520px layout is optimized for mobile phones but feels restrictive and "skinny" on tablet devices. Coaches often use tablets courtside, and the app should utilize the extra horizontal space to provide a more expansive view of the roster and game state.

## What Changes

- **Fluid Container Width**: Increase the maximum width of the `.app` container from 520px to 1000px.
- **Fluid Background**: Update the court background image scaling to cover the full width of the container.
- **Header Expansion**: Allow header actions and the team selector to spread out horizontally on wider screens.
- **Responsive Court Grid**: Ensure the 2-column game screen layout remains usable and balanced at wider widths.

## Capabilities

### New Capabilities
- `fluid-tablet-layout`: Defines the responsive behavior of the application container and background assets for larger screen sizes.

### Modified Capabilities

## Impact

- **GlobalStyles.jsx**: Updates to `.app` and `.app::before` styles.
- **GameScreen.jsx**: Potential layout validation for wide viewports.
