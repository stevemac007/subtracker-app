# Tech Stack & Build System

## Stack
- React 19 (functional components, hooks only — no class components)
- Vite 8 (dev server, bundler, HMR)
- sql.js 1.10.3 (SQLite compiled to WASM, loaded via CDN — not an npm dependency)
- ESLint 9 with flat config (react-hooks, react-refresh plugins)
- Netlify for deployment (static SPA)

## Key Libraries / APIs
- `sql.js` — loaded dynamically via CDN script injection, not imported from node_modules
- `localStorage` — persistence layer; SQLite DB exported as base64 string
- No routing library — screen navigation managed via React state
- No state management library — `useState`, `useReducer`, `useRef`, `useCallback` from React
- No CSS framework — custom CSS with CSS custom properties (dark theme)

## Fonts (loaded via Google Fonts CDN)
- Bebas Neue — headings, labels, buttons
- DM Mono — clock displays, timestamps, monospace data
- Inter — body text

## Common Commands
All commands run from the project root:

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server (localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `make deploy` | Build + draft deploy to Netlify |
| `make deploy-prod` | Build + production deploy to Netlify |

## ESLint Rules
- Unused vars allowed if name starts with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- React hooks rules enforced
- React Refresh rules for Vite HMR
