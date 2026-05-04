id: SUB-43-appstore-wrapper-wire-spa
title: Wire SPA build into wrapper
status: in_progress
priority: high
summary: Ensure wrapper consumes SPA build output from www and serves within Capacitor.

owners:
- CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)

dependencies:
- SUB-43-appstore-wrapper-skeleton (in_progress)
- SubTracker core SPA stability (existing)

tasks:
- task: Configure Capacitor to use www as webDir
  status: in_progress
- task: Verify build artifacts are accessible from native shell
  status: pending
