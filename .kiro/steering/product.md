# SubTracker — Product Overview

SubTracker is a basketball substitution tracker for coaches and scorekeepers. It runs entirely in the browser with no backend.

## Core Features
- Roster management (add, edit, deactivate players with jersey numbers)
- Game setup: select squad (up to 12), choose 5 starters
- Live game clock with quarter tracking (Q1–Q4 + OT)
- Tap-to-substitute: select players out/in, confirm swaps
- Real-time court time tracking per player
- Substitution log with quarter and game-time stamps
- Player stats overlay (court time, % of game played)
- Game history: review past games, resume in-progress, delete
- Offline-capable: all data persists in localStorage via in-browser SQLite (sql.js)

## Key Constraints
- No backend or server-side logic — everything runs client-side
- SQLite database stored as base64 in localStorage
- sql.js WASM binary loaded from CDN on first visit
- Designed as a mobile-first SPA (max-width 520px app container)
- Dark, scoreboard-inspired UI aesthetic
