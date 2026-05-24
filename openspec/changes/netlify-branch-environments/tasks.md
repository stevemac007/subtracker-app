## 1. Netlify Configuration

- [ ] 1.1 Create root-level `netlify.toml` with build command (`npm run build`), publish directory (`dist`), and SPA catch-all redirect (`/* → /index.html` with status 200)
- [ ] 1.2 Remove the `_redirects` file generation from the Makefile `build` target (now handled by `netlify.toml`)

## 2. GitHub Actions Deploy Workflow

- [ ] 2.1 Add a `deploy-preview` job to `.github/workflows/github-flow.yml` that runs on `pull_request` events, depends on the `ci` job, and uses `nwtgck/actions-netlify@v3` to deploy `dist/` as a preview with alias `deploy-preview-${{ github.event.number }}`
- [ ] 2.2 Add a `deploy-production` job to `.github/workflows/github-flow.yml` that runs on `push` to main, depends on the `ci` job, and uses `nwtgck/actions-netlify@v3` to deploy `dist/` to production
- [ ] 2.3 Configure both deploy jobs to reference `secrets.NETLIFY_AUTH_TOKEN` and `secrets.NETLIFY_SITE_ID`
- [ ] 2.4 Enable PR comment with deploy URL in the preview deploy job (`enable-commit-comment: true` or equivalent action option)

## 3. CI Job Adjustments

- [ ] 3.1 Ensure the `ci` job uploads the `dist/` directory as a workflow artifact so deploy jobs can download it without rebuilding
- [ ] 3.2 Add artifact download step to both deploy jobs

## 4. Documentation

- [ ] 4.1 Update `DEPLOY.md` to document the automated deploy pipeline, required GitHub secrets (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`), and how preview/production deploys work
- [ ] 4.2 Add a note to `DEPLOY.md` that manual `make deploy` / `make deploy-prod` commands remain available as fallback
