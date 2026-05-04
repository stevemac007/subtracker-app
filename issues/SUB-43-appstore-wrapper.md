id: SUB-43-appstore-wrapper
title: App Store Wrapping for SubTracker (iOS + Android)
status: in_progress
priority: high
summary: Create a native wrapper around the existing SubTracker SPA to publish on iOS App Store and Google Play Store. Use Capacitor-based wrapper with offline-first behavior and minimal native features.

owners:
- CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)

dependencies:
- SubTracker core SPA stability (existing)
- Design doc: openspec/changes/appstore-wrapping/design.md

tasks:
- task: Scaffold Capacitor-based wrapper skeleton (iOS + Android)
  status: in_progress
- task: Wire SPA build output into wrapper webDir (www)
  status: pending
- task: Add basic native assets (icons, splash screens) for iOS/Android
  status: pending
- task: Implement minimal native bridge (optional): wake-lock, notifications (as needed)
  status: pending
- task: Verify offline persistence in wrapper environment
  status: pending
- task: Prepare app submission checklist (privacy, permissions, branding)
  status: pending
- task: Create lightweight test harness to verify wrapper runs on simulators
  status: pending
