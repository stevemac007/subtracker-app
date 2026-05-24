id: SUB-43-D-webtest
title: WebView test for Capacitor wrapper
status: pending
priority: high
summary: Validate SubTracker SPA loads correctly inside Capacitor WebView; basic navigation and offline behavior checks.

owners:
- CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)

dependencies:
- SUB-43-A
- SUB-43-B-ios
- SUB-43-C-android

tasks:
- task: Create minimal test harness to load SPA in Capacitor WebView (webDir = www)
  status: pending
- task: Verify offline persistence works in WebView wrapper
  status: pending
- task: Capture baseline performance/initial load metrics in WebView
  status: pending
