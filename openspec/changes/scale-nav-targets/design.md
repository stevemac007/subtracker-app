## Context

The current SubTracker UI is designed for a mobile-first experience but uses legacy desktop-sized font and padding values for navigation controls. Specifically, the `.hbtn` (header button) and `.qbtn` (quarter button) classes use an 11px font and 5px vertical padding. On modern high-density mobile displays, these are difficult to hit accurately, especially during the fast-paced environment of a basketball game.

## Goals / Non-Goals

**Goals:**
- Increase tap targets for all primary navigation and control buttons to a minimum of 36px height.
- Improve legibility of utility labels (LOG, STATS, ROSTER, etc.) without losing the "scoreboard" aesthetic.
- Maintain the current 520px max-width container layout without regressions in overflow.

**Non-Goals:**
- This is not a full redesign of the app's visual identity.
- No changes to the database schema or core game logic.
- We are not introducing icons at this stage unless space constraints absolutely require it.

## Decisions

### 1. Scaling the Utility Button Class (`.hbtn`, `.qbtn`)
We will increase the font size and padding for the core utility button classes.
- **Decision**: Increase `font-size` from `11px` to `13px`. Increase `padding` from `5px 9px` to `8px 12px`.
- **Rationale**: This brings the button height from ~26px to ~37px, which is much closer to the accessibility sweet spot for "compact" mobile apps.
- **Alternatives**: Using `min-height: 44px`. Rejected because it would drastically change the header's vertical footprint and might crowd the court area.

### 2. Header and Clock Bar Breathing Room
To accommodate larger buttons, the containers must expand slightly.
- **Decision**: Increase `.hdr` padding from `8px 14px` to `10px 14px`. Increase `.clock-bar` padding from `6px 14px` to `8px 14px`.
- **Rationale**: Larger buttons need more "gutter" space to avoid looking cramped against the border.

### 3. Maintaining Hierarchy
We will ensure that primary action buttons (like "+ NEW GAME" or "SAVE") remain distinct from utility buttons.
- **Decision**: Primary buttons will maintain their `16px+` font size and `10px+` padding, ensuring they are always the most accessible elements on the page.

## Risks / Trade-offs

- **[Risk] Horizontal Overflow in Header** → If a team name is very long, the Roster/History buttons might push it off-screen. 
  - **Mitigation**: The `.hdr-team` already has `text-overflow: ellipsis`. We will verify that the remaining space is sufficient for 2-3 utility buttons.
- **[Risk] Clock Bar Crowding** → The quarter selection buttons (`Q1`, `Q2`, etc.) might wrap on very narrow devices.
  - **Mitigation**: We will use `gap: 4px` (current) and ensure the container uses `flex-shrink: 0`.
