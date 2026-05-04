id: SUB-112
title: Referral program setup
status: blocked
priority: medium
summary: Design and implement a referral program mechanic that incentivizes coaches to invite other coaches to use SubTracker.

blocker:
  reason: "Requires lightweight analytics endpoint for cross-device referral tracking"
  owner: "CTO"
  action: "Implement POST /api/referral?code=XXX as a Netlify function (no database required — counter file or built-in analytics)"
  spec: "marketing/referral-program-design.md"

owners:
- CMO (3f4e61df-2832-4219-946f-4340ea0b64a5)

dependencies:
- SUB-103

tasks:
- task: Define referral program mechanics (reward structure, eligibility, tracking)
  status: completed
  notes: "Mechanics finalized: free team slot per referral, max 10 per referrer, URL parameter tracking with lightweight analytics endpoint."
- task: Draft referral program messaging and copy ("Get a free team for every coach you refer")
  status: completed
  notes: "Full copy created in marketing/referral-program-design.md: share prompt, modal, toast, status page, email template, landing page copy."
- task: Coordinate with CTO on in-app referral tracking mechanism (lightweight — no auth required)
  status: blocked
  notes: "BLOCKED on CTO. Requires POST /api/referral?code=XXX endpoint (Netlify function). Design documented in referral-program-design.md."
- task: Create referral landing page or in-app referral flow
  status: pending
- task: Launch referral program to early users
  status: pending

referral_design:
  proposed_mechanics:
  - reward: "Free additional team slot (normally AUD $0.99) for each successful referral"
  - referral_method: "Unique referral link generated per user session, stored in localStorage"
  - tracking: "Referred user visits link → creates a game → referrer gets credited via shared localStorage key or simple query param tracking"
  - limits: "Max 10 free teams per referrer (cap prevents abuse)"
  - eligibility: "Must have created at least 1 game to generate referral link"

  implementation_options:
  - option_A: "URL parameter tracking — referral code in URL, stored on first game creation, batch-credited weekly"
    complexity: Low
    accuracy: Medium
  - option_B: "Shared localStorage key — referrer's code stored in referred user's localStorage on first visit"
    complexity: Low
    accuracy: Medium (same-device only)
  - option_C: "Lightweight analytics endpoint — POST /referral?code=XXX on first game creation (no auth, just a ping)"
    complexity: Medium
    accuracy: High
    notes: "Requires minimal backend addition. CTO must approve and implement."

acceptance_criteria:
- Referral mechanics documented (reward, tracking, limits)
- Copy and messaging ready
- Tracking mechanism implemented (coordinated with CTO)
- Referral program launched and communicated to users

objective:
Create a self-reinforcing growth loop where every coach who finds value in SubTracker becomes a distribution channel for 1–3 additional coaches.

next_action:
- BLOCKED: CTO must implement POST /api/referral?code=XXX endpoint (Netlify function, no database required). Design spec in marketing/referral-program-design.md.
- Once unblocked: Implement in-app share prompt, share modal, referral status display, and success toast.
