id: SUB-43-appstore-wrapper-skeleton
title: Capacitor wrapper skeleton for App Store
status: in_progress
priority: high
summary: Scaffold Capacitor wrapper skeleton (iOS + Android) to host SubTracker SPA.

owners:
- CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)

dependencies:
- SubTracker core SPA stability (existing)
- Design doc: openspec/changes/appstore-wrapping/design.md

tasks:
- task: Initialize Capacitor project and config for iOS and Android
  status: in_progress
- task: Setup webDir to point to SPA build (www)
  status: pending
- task: Prepare minimal native shell to host web app
  status: pending
