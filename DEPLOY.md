# Deploying SubTracker to Netlify (Free Tier)

## Prerequisites

- Node.js 18+
- A free [Netlify](https://app.netlify.com/signup) account
- Netlify CLI installed globally:

```bash
npm install -g netlify-cli
```

## Option 1: Deploy via CLI (manual)

### 1. Log in

```bash
netlify login
```

This opens a browser window to authorize the CLI.

### 2. Build

```bash
cd subtime-app
npm install
npm run build
```

This outputs a production build to `dist/`.

### 3. Deploy a preview

```bash
netlify deploy --dir=dist
```

On first run, the CLI will prompt you to link or create a new site. Choose "Create & configure a new site", pick a team, and optionally give it a name.

This deploys a draft URL you can test before going live.

### 4. Deploy to production

```bash
netlify deploy --dir=dist --prod
```

Your site is now live at `https://<site-name>.netlify.app`.

## Option 2: Git-based continuous deployment

1. Push your repo to GitHub, GitLab, or Bitbucket.
2. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project".
3. Connect your repo and configure:

| Setting | Value |
|---|---|
| Base directory | `subtime-app` |
| Build command | `npm run build` |
| Publish directory | `subtime-app/dist` |

4. Click "Deploy". Netlify will build and deploy on every push to your main branch.

## Makefile

A `Makefile` is included in the project root for convenience:

```
make install    # install dependencies
make build      # production build
make deploy     # draft deploy to Netlify
make deploy-prod # production deploy to Netlify
```

## Netlify Free Tier Limits

- 100 GB bandwidth / month
- 300 build minutes / month
- 1 concurrent build
- Unlimited sites

SubTracker is a static SPA with no server-side logic, so it fits comfortably within these limits.

## SPA Routing

A `_redirects` file is created in `public/` to ensure Netlify serves `index.html` for all routes (standard SPA behavior). This is handled automatically by `make build`.

## Troubleshooting

- If `netlify` command is not found, make sure the CLI is installed: `npm install -g netlify-cli`
- If the deploy fails with auth errors, run `netlify login` again
- If you see a blank page after deploy, check the browser console — sql.js needs network access on first load to fetch its WASM binary from the CDN
