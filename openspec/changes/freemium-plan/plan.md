# Freemium Model Plan (SUB-41) — Remaining Work

Objective
- Complete the freemium model implementation: 1 free team; AUD 0.99 per additional team, with no time/game limits on the free tier.

Scope
- UI and pricing logic refinements, tests, and optional backend enforcement discussion.

Plan Revisions
- This plan represents the remaining work as discussed in SUB-41 wake cycles. Any changes should be captured in this plan and re-confirmed before implementation subtasks are created.

Phases and Deliverables
- Phase 1 — Testing scaffolding and unit tests
  - Expand unit tests for pricing logic (billing.js) to cover edge cases (0 teams, non-numeric input).
  - Ensure pricing module has clear, documented edge-case behavior.
  - Deliverable: updated tests/billing.test.mjs and documentation in billing.js JSDoc.

- Phase 2 — UI tests for freemium banner
  - Add Playwright-based UI test that renders the freemium banner and validates current price when teams change.
  - Deliverable: tests/freemium-banner.spec.js skeleton and initial assertions.

- Phase 3 — Backend gating (optional, decision gate)
  - If product requires enforcement, design and outline a server-side freemium gate (feature flag, API contract).
  - Deliverable: plan/doc outlining API changes and gating strategy; wait for confirmation.

- Phase 4 — CI integration
  - Wire the freemium tests into CI; ensure flaky tests are reduced.
  - Deliverable: CI config updates and test run expectations.

- Phase 5 — Documentation
  - Update user-facing docs and internal docs with freemium policy, pricing, and edge cases.
  - Deliverable: README/pages updates and a changelog entry.

Milestones
- Milestone 1: Pricing unit tests expanded and stabilized.
- Milestone 2: UI tests present and passing in local/dev CI.
- Milestone 3: Backend gating plan approved or deferred with explicit decision.
- Milestone 4: CI integration complete and docs updated.

Risks and Assumptions
- Assumes the client wants a client-side visibility of pricing before backend enforcement.
- Backend gating is optional; if not required, UI-only freemium hook remains in scope.

Dependencies
- Billing utility (src/billing.js) and HomeScreen freemium UI already implemented.

Next Actions (after plan approval)
- Create implementation subtasks as child issues (pricing tests, UI tests, backend gating, CI, docs).
- If plan is approved, generate concrete confirmations and start execution.
