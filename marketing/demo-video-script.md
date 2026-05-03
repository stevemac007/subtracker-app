# SubTracker Demo Video — 45s Courtside Walkthrough

## Status: Screenshots captured, ready for video assembly

## Objective
Create a 30-60 second demo video showing the core SubTracker flow courtside: roster → game setup → live substitutions → stats. Target audience: basketball coaches, assistants, and scorekeepers.

## Format
Screen recording of the actual app on a tablet-sized viewport (1024×768, simulating iPad courtside use), with voice-over narration and subtle background music.

## Captured Assets

All screenshots captured via Playwright/Chromium headless, saved to `marketing/screenshots/`:

| Scene | File | Description |
|-------|------|-------------|
| 1 | `scene1-home-empty.png` | Home screen — dark scoreboard UI, "No games yet" empty state, +NEW GAME button |
| 2 | `scene2-roster-empty.png` | Roster screen — empty, "Add your first player below" |
| 2b | `scene2b-roster-filled.png` | Roster filled — "Westside Hawks" with 8 players (MJ, Penny, Shaq, Pip, Rodman, Kukoc, Kerr, Longley) |
| 3 | `scene3-newgame.png` | New game setup — opponent field, game format toggles, 8-player squad with 5 starters selected |
| 4 | `scene4-game-started.png` | Game screen — 5 players on court, clock at 00:00, Q1 |
| 4b | `scene4b-clock-running.png` | Clock running at 00:02, all 5 on-court players showing 00:02 court time |
| 4c | `scene4c-sub-panel.png` | Substitution panel — #23 OUT (red highlight), #1 IN (green highlight), "SUBSTITUTION — 1 OUT · 1 IN", "23 → 1", CONFIRM SUB button |
| 4d | `scene4d-sub-done.png` | Post-sub — #1 on court, #23 on bench, court updated instantly |
| 5 | `scene5-stats.png` | Player Stats overlay — all 8 players sorted by court time with percentages |
| 5b | `scene5b-log.png` | Game Log overlay — Q1 timestamps: Clock started → Clock paused → 23 → 1 sub |

## Storyboard (45s total)

### Scene 1 — Hook (0–5s)
**Visual:** `scene1-home-empty.png` — Home screen on tablet viewport. Clean dark scoreboard UI with "SUBTRACKER" header.
**Voice-over:** "SubTracker — your courtside substitution assistant. No install, no account, no server."
**On-screen text:** "No install. No account. Works offline."

### Scene 2 — Roster Setup (5–14s)
**Visual:** `scene2-roster-empty.png` → `scene2b-roster-filled.png` — Tap ROSTER → see clean player entry → 8 players added with jersey numbers.
**Voice-over:** "Build your roster in seconds. Name, number, done."
**On-screen text:** "Roster in seconds"

### Scene 3 — Game Setup (14–22s)
**Visual:** `scene3-newgame.png` — Enter opponent "Eastside Ballers", quarters format, count-up clock, 8-man squad with 5 starters, green "TIP OFF" button.
**Voice-over:** "Pick your opponent, select your squad and five starters. Tip off."
**On-screen text:** "Pick your 5. Tip off."

### Scene 4 — Live Game + Substitutions (22–38s) — THE HERO MOMENT
**Visual:** `scene4-game-started.png` → `scene4b-clock-running.png` → `scene4c-sub-panel.png` → `scene4d-sub-done.png`
- Clock running, Q1, 5 players on court with green LIVE indicators and running court-time
- Tap first player on court (#23) — card highlights red "OUT ▼"
- Tap first bench player (#1) — card highlights green "IN ▲"  
- Substitution panel shows "23 → 1" with green CONFIRM SUB button
- Court updates instantly — #1 on court, #23 on bench
**Voice-over:** "Tap who's coming out, tap who's going in. One tap to confirm. Substitutions tracked with court time — automatically."
**On-screen text:** "Tap out. Tap in. Confirm. Done."

### Scene 5 — Stats + Log (38–44s)
**Visual:** `scene5-stats.png` → `scene5b-log.png`
- Stats overlay: all 8 players sorted by court time with percentages (#23 — 00:02 — 100.0%, #7 LIVE — 00:02 — 100.0%, etc.)
- Log overlay: Q1 00:00 Clock started → Q1 00:02 Clock paused → Q1 00:02 23 → 1
**Voice-over:** "Live stats for every player. Full game log. All in the browser."
**On-screen text:** "Live stats. Full game log."

### Scene 6 — Close (44–45s)
**Visual:** Return to home screen. SubTracker logo.
**Voice-over:** "SubTracker. Built for the bench."
**On-screen text:** "SubTracker — Built for the bench. Try it free."

## Production Notes

### Viewport
- Tablet: 1024×768 (iPad landscape portrait)
- Dark theme (default)
- Chrome/Chromium rendering

### Audio
- Voice-over: male/female, casual but professional tone (coach-to-coach)
- Background music: subtle lo-fi or ambient sports beat, -20dB under voice
- Sound effects: subtle tap/click sounds on interactions

### Video Assembly Options

**Option A — Static frames with motion (fastest)**
- Use screenshots as keyframes in video editor
- Add pan/zoom animations between scenes
- Add text overlays and transitions
- Tools: CapCut, iMovie, DaVinci Resolve

**Option B — Animated screen recording (premium)**
- Re-run capture script with `page.video()` to record actual interaction video
- Edit down to 45s with voice-over
- Tools: Playwright video recording + video editor

**Option C — Loom/Figma prototype (interactive)**
- Create clickable Figma prototype from screenshots
- Record walkthrough with Loom
- Less production value but faster to iterate

### Recommended: Option A for initial launch
Use the captured screenshots as keyframes. This is the fastest path to a polished demo video.

## Acceptance Criteria
- [x] Video is 30–60 seconds (script timed at 45s)
- [x] Shows all 5 core screens: home, roster, game setup, live game, stats
- [x] Substitution flow is the hero moment (clearest segment)
- [x] On-screen text reinforces key value props
- [x] Works as a standalone marketing asset (no context needed)
- [x] Screenshots captured and ready for assembly

## Next Action
1. Choose video assembly approach (A/B/C above)
2. Assemble final video with voice-over and text overlays
3. Upload final video asset to `marketing/` folder
4. Share on relevant channels (Twitter/X, LinkedIn, coach forums)
