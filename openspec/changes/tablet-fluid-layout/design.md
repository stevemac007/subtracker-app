## Context

The application currently has a hard-coded `max-width: 520px` in `GlobalStyles.jsx`. This was an intentional choice for the MVP to ensure a consistent look on all phones. However, it prevents the app from taking advantage of tablet and desktop screen real estate.

## Goals / Non-Goals

**Goals:**
- Expand the maximum application width to 1000px.
- Ensure the background court image scales fluidly with the container.
- Keep the application centered on screens wider than 1000px.

**Non-Goals:**
- We are not changing the 2-column layout to a 3-column layout at this time.
- We are not redesigning the player cards.

## Decisions

### 1. Increase `max-width` to 1000px
- **Decision**: Update `.app` in `GlobalStyles.jsx` from `max-width: 520px` to `max-width: 1000px`.
- **Rationale**: 1000px covers most tablets in landscape and provides a generous layout on desktop without causing the "stretched court" risk of 100% fluid width on ultra-wide monitors.

### 2. Fluid Background Scaling
- **Decision**: Change `.app::before` background size from `520px auto` to `100% auto`.
- **Rationale**: This ensures the court lines always span the full width of the visible application area, regardless of whether it's 375px (iPhone) or 1000px (iPad).

### 3. Center the Container
- **Decision**: Keep `margin: 0 auto` on the `.app` class.
- **Rationale**: This ensures the app remains centered on large monitors, maintaining a professional "app-like" feel.

## Risks / Trade-offs

- **[Risk] Extreme Stretches** → At 1000px, player cards will be significantly wider than at 520px.
  - **Mitigation**: The 2-column grid (`grid-template-columns: 1fr 1fr`) naturally handles this. If cards feel too sparse, we can reconsider card-specific max-widths in a future iteration.
- **[Risk] Horizontal Header Drift** → Team name and action buttons will move far apart.
  - **Mitigation**: This is acceptable for a tablet experience. The team name remains centered via `flex: 1` and `text-align: center`.
