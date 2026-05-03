# SubTracker App Store Wrapping - Design

- Engine choice: Capacitor as wrapper to host the SPA with a WebView, exposing minimal native features when needed.
- Project layout: separate ios/ and android/ wrapper projects that mount the existing SPA build output.
- Offline strategy: ensure SPA uses localStorage/indexedDB and a persisted SQLite export path where feasible within the wrapper.
- Build pipeline: introduce wrapper-specific config (capacitor.config.json), platform-specific assets (icons, splash screens), and a basic prepublish hook.
- Compliance: outline privacy, data usage, and disclosure requirements for App Store/Play Store submission.
