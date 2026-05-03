GitHub Flow

- Create a feature branch from main (or master):
  - git checkout -b feature/your-feature-name
- Make small, testable changes. Run local tests if possible.
- Open a pull request against main (or master). Provide a clear description of the change and why it’s needed.
- CI will run on PRs. Fix any issues the CI reports.
- Have at least one code reviewer approve the PR before merging.
- Use squash-merges if possible to keep a clean history.

Branch naming conventions
- feature/xxx for features
- fix/xxx for bug fixes
- chore/xxx for housekeeping tasks

How to run locally
- Install dependencies: npm ci
- Lint: npm run lint
- Test: npm test
- Build: npm run build

Notes
- This project uses a GitHub Flow with PR-based integration. Ensure CI passes before merging.
