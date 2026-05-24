# SubTracker

Basketball substitution tracker for coaches. Manage your roster, run a live game clock, and track player court time and substitutions in real time — all from your browser.

## Features

- Roster management — add, edit, and deactivate players with jersey numbers
- Game setup — pick your squad (up to 12) and choose 5 starters before tip-off
- Live game clock with quarter tracking (Q1–Q4 + OT)
- Tap-to-substitute — select players going out and coming in, confirm swaps in one action
- Real-time court time tracking per player
- Substitution log with quarter and game-time stamps
- Player stats overlay showing court time and percentage of game played
- Game history — review past games, resume in-progress ones, or delete them
- Offline-capable — data persists in localStorage via an in-browser SQLite database (sql.js)

## Tech Stack

- React 19 + Vite 8
- sql.js (SQLite compiled to WebAssembly, loaded via CDN)
- No backend — all data lives in the browser's localStorage
- Custom CSS with a dark, scoreboard-inspired UI (Bebas Neue + DM Mono + Inter)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## How It Works

The app loads sql.js from a CDN on first visit, creates a local SQLite database, and stores it as a base64 string in localStorage. All roster, game, and substitution data is managed through SQL queries against this in-browser database — no server required.

## License

Private
