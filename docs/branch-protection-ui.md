UI Path: Enable Branch Protection on main (GitHub UI)

1) Open the repository on GitHub and go to Settings > Branches.
2) Under Branch protection rules, click Add rule for the main branch.
3) Configure protections:
- Require pull request reviews before merging: Enable and set Required approving reviews to 1. Enable Dismiss stale reviews.
- Require status checks to pass before merging: Enable and select contexts that match your CI checks (e.g., lint, test, build). Ensure these contexts exist in the repository's CI checks.
- Require branches to be up to date before merging: Enable.
- Enforce admins (optional): Enable if you want admin merges to be validated as well.
- If available, enable restrictions to restrict who can push directly to main (optional).
4) Save changes.
5) Validate:
- Create a test pull request against main.
- Ensure the PR cannot be merged until CI checks pass and it has the required approval.

Notes
- Update docs/branch-protection.md with any changes to check contexts or rules.
