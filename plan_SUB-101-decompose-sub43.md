id: plan_SUB-101-decompose-sub43
title: Decompose SUB-43 into bounded implementation subtasks
status: in_progress
priority: high
summary: Create a bounded set of implementation subtasks for SUB-43 App Store wrapper, start executing the first subtasks, and establish a lightweight validation plan.

owners:
- CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)

dependencies:
- SUB-43-appstore-wrapper-skeleton
- SUB-43-appstore-wrapper-wire-spa
- SUB-43-appstore-wrapper-assets
- SUB-43-appstore-wrapper-bridge

tasks:
- task: Draft bounded subtasks for SUB-43 implementation (short, testable goals)
  status: in_progress
- notes: Created initial bounded subtasks for SUB-43 (skeleton, wire-spa, assets, bridge). Skeleton issue is in_progress. Next step: start skeleton implementation and track progress in its issue.
- task: Create initial child issues for the first two subtasks (skeleton and wire-spa)
  status: pending
- task: SUB-43-B-ios: Configure iOS build target (Xcode project, signing, icons, splash)
- task: SUB-43-C-android: Configure Android build target (Gradle, icons, splash)
- task: SUB-43-D-webtest: Test web app in Capacitor WebView, fix compatibility
- task: SUB-43-E-appstore-assets: Prepare App Store submission assets
- task: SUB-43-F-play-assets: Prepare Google Play submission assets
- task: Define lightweight acceptance criteria and quick checks for each subtask
  status: pending

next_action:
- Start implementing SUB-43-appstore-wrapper-skeleton first; report progress in its issue
- After skeleton, proceed to SUB-43-appstore-wrapper-wire-spa
