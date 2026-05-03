# SubTracker App Store Wrapping - Proposal

- Objective: Explore and outline a wrapper strategy to publish SubTracker on iOS App Store and Google Play Store using a native wrapper that hosts the existing web app with offline capabilities.
- Approach: Prefer a lightweight, standards-based wrapper (Capacitor or similar) over a full native rewrite to preserve fast iteration with the current SPA.
- Scope (high level):
  - Create an iOS wrapper project and an Android wrapper project that run the existing SubTracker SPA in a WebView with offline storage plumbed.
  - Ensure offline-first behavior, local storage persistence, and native app lifecycle integration.
  - Provide basic native features: launcher icon, splash screen, app metadata, and a tiny bridge for optional native features (notifications, wake-lock).
  - Prepare packaging steps and App Store/Play Store submission guidance.
- Risks and tradeoffs:
  - Performance and offline parity depend on the wrapper stack; possible edge-cases with Service Worker in WebView.
  - App review guidelines require white-labeling, privacy disclosures, and data storage considerations.
- Success criteria (minimal):
  - A documented wrapper plan with recommended stack (Capacitor), project scaffolding steps, and a lightweight test harness that proves the SPA runs inside a native wrapper on both platforms.
- Next actions (pending):
  1) Confirm preferred wrapper technology and versions.
  2) Create a stub wrapper repo layout and CI signals (sanity check).
  3) Draft minimal integration points and a risk register.
