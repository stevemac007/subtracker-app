## Why

The project currently deploys manually via `netlify deploy` CLI commands with no automated environment strategy. There's no way to preview feature branches before merging, and production deploys require manual intervention. Setting up multiple Netlify environments with GitHub Actions enables automated preview deploys for PRs and controlled production deploys on merge to main.

## What Changes

- Add a GitHub Actions workflow that deploys to Netlify preview environments on pull requests
- Add a GitHub Actions workflow step that deploys to Netlify production on push to main
- Move from CLI-based manual deploys to CI-driven automated deploys
- Add a `netlify.toml` at the project root for build configuration (replacing the `.netlify/netlify.toml` managed by the UI)
- Store Netlify auth token and site ID as GitHub repository secrets

## Capabilities

### New Capabilities
- `branch-deploy`: Automated Netlify preview deploys triggered by pull requests, with deploy URL posted as a PR comment
- `production-deploy`: Automated Netlify production deploy triggered on push/merge to main branch

### Modified Capabilities

## Impact

- `.github/workflows/github-flow.yml` — will be extended with deploy jobs that run after CI passes
- `netlify.toml` — new root-level config file for Netlify build settings and SPA redirects
- `Makefile` — may be updated to reflect new deploy workflow
- `DEPLOY.md` — documentation updated to describe the automated pipeline
- GitHub repository settings — requires `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets to be configured
