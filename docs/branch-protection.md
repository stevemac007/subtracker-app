Branch Protection: Main

Overview
- Protecting the main branch helps ensure that only validated, reviewed code is merged.
- This document captures recommended settings for the Paperclip project in this repository.

Recommended settings (GitHub UI or API):
- Require pull request reviews before merging: require at least 1 approving review; enable "Dismiss stale reviews".
- Require status checks to pass before merging: enable with the CI checks you run (e.g., GitHub Flow workflow). If you have multiple checks, list them as required contexts.
- Require branches to be up to date before merging: ensures main is updated with the latest changes before merge.
- Include administrators: optionally enable if you want admins to also follow the rules.
- Enable required commits: optional; enforce linear history by requiring all merges to be via pull requests (no direct pushes).
- Dismiss stale reviews when new commits are pushed: ensure fast feedback on updates.

Notes
- The CI workflow named "GitHub Flow" in .github/workflows/github-flow.yml is assumed to be the status check context.
- After enabling protections, new PRs to main must pass the CI checks and obtain approvals before merging.

How to enable (UI):
- Go to GitHub > Repositories > YourRepo > Settings > Branches > Add rule (or Edit protection for main).
- Set protection rules as listed above and save.

Automation (optional):
- If you prefer API-based setup, you can script using the GitHub REST API:
  - Endpoint: PUT /repos/{owner}/{repo}/branches/{branch}/protection
  - Provide required_status_checks, enforce_admins, required_pull_request_reviews, etc.
- Example command (requires a GitHub token with repo scope):
  gh api -X PUT /repos/{owner}/{repo}/branches/main/protection \
    -f required_status_checks='{"strict":true,"contexts":["GitHub Flow"]}' \
    -f enforce_admins=true \
    -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}'
