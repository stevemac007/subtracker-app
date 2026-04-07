# Project Structure

```
subtime-app/                  # App root (all commands run from here)
├── index.html                # SPA entry point
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite config (React plugin)
├── eslint.config.js          # ESLint flat config
├── Makefile                  # Build/deploy shortcuts
├── DEPLOY.md                 # Netlify deployment guide
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx              # React root mount (StrictMode)
│   ├── App.jsx               # Entire application (single-file architecture)
│   ├── App.css               # Vite scaffold CSS (mostly unused)
│   ├── index.css             # Vite scaffold CSS (mostly unused)
│   └── assets/               # Static images
└── dist/                     # Build output (gitignored)
```

## Architecture Notes
- The app is a single-file architecture: `App.jsx` contains all components, styles, DB logic, and SQL schema (~1100 lines).
- Styles are defined inline via a `<GlobalStyles>` component that injects a `<style>` tag — not in external CSS files.
- `App.css` and `index.css` are leftover Vite scaffold files and are largely unused by the app.
- Screen navigation is state-driven (no router). The main `App` component switches between screens: Home, Roster, History, Game Setup, Live Game.
- Database helpers (`dbAll`, `dbGet`, `dbRun`) wrap sql.js and auto-save to localStorage after every write.
- No component library or external UI dependencies.
