SUB-105-3: In-app Instrumentation
Owner: CTO
Dependencies: SUB-105, SUB-105-2

Goal
- Instrument crash analytics with meaningful events and minimal overhead.

Plan
- Define a minimal set of events to capture (e.g., crash occurrences, API error rates, user impact signals).
- Implement error boundaries and global error handlers on the frontend.
- Implement backend event hooks to correlate client errors with server-side data.
- Ensure privacy: redact PII, respect opt-out flags, and minimize payload size.

Acceptance Criteria
- Frontend emits structured error events; backend accepts and stores/replays a subset of data safely.
- Privacy safeguards are in place and documented.

Next Steps
- Move to SUB-105-4 for dashboards/metrics definitions.
