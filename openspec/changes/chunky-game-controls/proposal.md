## Why

During a live game, coaches need to interact with the clock, quarter, and logs with zero friction. The current controls, while improved, are still relatively small for a "high-intensity" touch environment. Scaling these to "chunky" proportions ensures reliable interaction during active play.

## What Changes

- **Clock Control Scaling**: Significantly increase the size of START/PAUSE and ZERO buttons.
- **Quarter Selection Scaling**: Increase the size of Q1-Q4/OT buttons to match primary nav heights.
- **Header Action Scaling**: Increase the LOG, STATS, and END buttons in the Game Screen header.
- **Sort Toggle Scaling**: Expand the vertical "GAME/STINT" toggle to be easier to tap.
- **Clock Display Bump**: Increase the font size of the main clock digits for better distance legibility.

## Capabilities

### New Capabilities
- `game-day-controls`: Defines high-visibility, large-format control standards for the live game environment.

### Modified Capabilities

## Impact

- **GlobalStyles.jsx**: Updates to `.qbtn`, `.cbtn`, `.hbtn`, and `.clock-disp`.
- **GameScreen.jsx**: Adjustments to clock bar layout and header action spacing.
