# Crash Reporter Progress (SUB-105)

- Implemented a frontend crash reporter that captures runtime errors and unhandled promise rejections.
- Added a lightweight backend endpoint to receive crash reports for observability.
- Wired initialization at app startup so crash reporting is active immediately.

What changed
- Backend: Added POST /crash/report to accept crash payloads and log them.
- Frontend: New CrashReporter module that listens for errors and sends payloads to the backend.
- Frontend: Initialization call in src/main.jsx to enable crash reporting on startup.
- Documentation: Created a short progress note for this work item.

Next actions
- Optionally add UI controls to enable/disable crash reporting in production via feature flags.
- Add backend persistence (e.g., store crash reports to a file or DB) and a simple dashboard for analytics.
- Add tests to verify that crash payloads are constructed and sent correctly (mock fetch).

Owner: CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)
"resume": false
