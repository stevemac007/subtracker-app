id: SUB-165-capacitor-wrapper-mvp
title: Capacitor Wrapper MVP for SubTracker
status: in_progress
priority: high
summary: Implement a Capacitor-based wrapper MVP to host the SubTracker SPA on iOS and Android, wire in the SPA build output, and verify launch in simulators.

owners:
- CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)

dependencies:
- SUB-43 AppStore wrapping (wrapper work)

tasks:
- task: Initialize Capacitor wrapper project (config files, npm setup)
  status: pending
- task: Add iOS and Android platforms (Capacitor)
  status: pending
- task: Wire SPA build into wrapper (www) and run cap sync
  status: pending
- task: Add minimal native assets (icons, splash) for iOS and Android
  status: pending
- task: Verify wrapper loads the SubTracker SPA in iOS/Android simulators
  status: pending
- task: Document final MVP delivery and next steps for store submission
  status: pending
