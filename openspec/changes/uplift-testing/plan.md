# Uplift Testing Plan

- Objective: Establish uplift testing scaffolding and write at least one uplift smoke test to validate core flows.
- Scope: tests/ suite, uplift hooks, minimal smoke test, and integration with CI in later steps.
- Key steps:
 1. Inspect existing test suite to identify critical paths (game flow, history, etc.).
 2. Introduce uplift/test-helpers to expose higher-level scenarios.
 3. Add a minimal uplift smoke test that exercises a core path (e.g., start a new game, end game).
 4. Run tests locally; fix failures; ensure test stability.
- Acceptance Criteria:
  - A new uplift-testing plan exists and is linked to SUB-29 uplift testing.
  - At least one uplift smoke test is present and passes locally.
  - Documentation notes updated with how to run uplift tests.
