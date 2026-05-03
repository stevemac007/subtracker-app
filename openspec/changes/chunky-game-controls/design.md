## Context

Building on the `scale-nav-targets` change, this design focuses specifically on the "Live Game" experience. We are moving from "accessible" targets (~36px) to "high-impact" targets (~44px-52px) for critical game controls.

## Goals / Non-Goals

**Goals:**
- Scale live-game controls (Clock, Quarters, Header Actions) to 44px-52px height.
- Increase clock digit size for better legibility from a distance.
- Maintain a balanced layout on the now 1000px-wide tablet canvas.

**Non-Goals:**
- No changes to the underlying game clock logic or state machine.
- No changes to the player cards or substitution flow.

## Decisions

### 1. Clock Display and Buttons
- **Decision**: Increase `.clock-disp` font from 36px to 48px. Increase `.cbtn` padding to 12px 18px and font to 18px.
- **Rationale**: The clock is the most important element on the screen. Making it and its controls "chunky" minimizes the cognitive load for the coach.

### 2. Header and Quarter Buttons
- **Decision**: Increase Game Screen header `.hbtn` font to 15px and padding to 12px 18px. Match `.qbtn` height to the header buttons (~44px).
- **Rationale**: Consistent scaling across all primary action triggers.

### 3. Vertical Sort Toggle
- **Decision**: Increase `.hbtn` with vertical writing mode to 14px font and 14px vertical padding.
- **Rationale**: Makes the toggle a tall, easy-to-hit strip on the right side of the screen.

## Risks / Trade-offs

- **[Risk] Layout wrapping in Clock Bar** → If the clock digits and buttons are all too wide, the bar might wrap.
  - **Mitigation**: With the 1000px width, there is ample horizontal space. We will use `flex-wrap: wrap` as a fallback if necessary for smaller tablets.
