SubTracker Wrapper MVP (Capacitor)

- Purpose: Provide a minimal native wrapper around the existing SubTracker SPA to enable iOS and Android builds for App Store / Play Store submission.
- What this scaffold includes:
  - Capacitor config pointing to a web buildDir (www).
  - Placeholder web content to verify the wrapper hosts the SPA.
  - Lightweight guidance for wiring the actual SPA build artifacts into the webDir.
- Next steps:
  1. Choose Capacitor version and install dependencies.
  2. Wire in the actual SubTracker SPA build output into wrapper-skeleton/www.
  3. Implement basic assets for iOS/Android (icons, splash screens).
  4. Build and run in simulators to confirm basic flow.
