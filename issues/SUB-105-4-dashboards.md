SUB-105-4: Dashboards & Post-Launch Metrics Spec
Owner: CTO
Status: published

---

## Tool

Sentry (default). All dashboard queries below are expressed in Sentry terminology.
Mixpanel is explicitly deferred and is not part of this rollout.

---

## Core KPIs

| Metric | Target | Alert threshold |
|---|---|---|
| Crash-free sessions | ≥ 99.5 % | < 99 % → page on-call |
| Crash-free users | ≥ 99.5 % | < 99 % → page on-call |
| Error rate (events/min) | Baseline TBD in first 7 days | > 2× 7-day rolling average |
| P95 frontend JS error volume | Monitor | > 50 new unique errors/day |
| Backend crash/report ingestion | 100 % of frontend errors reach endpoint | Any 5xx on /crash/report |

---

## Dashboard: Frontend Crash Analytics

**Widget 1 — Crash-free sessions / users (Release Health)**
- Sentry: Projects → Release Health → Sessions and Users breakdown by release.
- Granularity: hourly for last 24 h; daily for last 30 d.

**Widget 2 — Top exceptions by volume**
- Sentry: Issues → sorted by Event Count.
- Filters: `level:error environment:production`.
- Show: issue title, affected users, first/last seen, event count.

**Widget 3 — Error rate over time**
- Sentry: Discover → `event.type:error` with 1-hour interval.
- Overlay releases to correlate spikes with deploys.

**Widget 4 — Release health timeline**
- Sentry: Releases → compare last 3 releases.
- Track: crash rate delta between releases.

---

## Dashboard: Backend /crash/report Ingestion

**Widget 5 — Endpoint health**
- Source: server logs / Sentry backend SDK.
- Query: count of POST /crash/report grouped by HTTP status (200 vs 503 vs 5xx).
- 503 = crash_reporting flag off (expected during staged rollout).

**Widget 6 — Payload volume by type**
- Derived from logged crash payloads.
- Group by `message` prefix to identify top unhandled rejection types.

---

## Alerting Rules

| Rule | Condition | Channel |
|---|---|---|
| Crash-free sessions degraded | < 99 % in any 1-hour window | Slack #alerts-prod + page on-call |
| New high-volume error | Single issue > 100 events/hour | Slack #alerts-prod |
| /crash/report 5xx | Any 500 response | Slack #alerts-prod |
| Release regression | Crash rate increase ≥ 10 % vs previous release | Slack #alerts-prod |

Alert setup: Sentry → Alerts → Create Alert Rule. Use issue-alert type for new/regression errors.

---

## Feature Flag Rollout Plan

| Stage | FEATURE_CRASH_REPORTING_ENABLED | VITE_CRASH_REPORTING_ENABLED | VITE_SENTRY_DSN | Notes |
|---|---|---|---|---|
| 0 — off | false | false | unset | Default before go-live |
| 1 — backend only | true | false | unset | Endpoint active, no frontend SDK |
| 2 — native capture | true | true | unset | Native JS error listeners active, no Sentry SDK |
| 3 — full Sentry | true | true | set | Full SDK active for all sessions |

Rollback: set `FEATURE_CRASH_REPORTING_ENABLED=false` to disable the backend ingest endpoint immediately.

---

## Data Retention & Privacy

- Sentry default retention: 90 days for errors, 30 days for sessions.
- No PII in crash payloads — `userAgent` is captured; no user IDs or email addresses.
- `beforeSend` hook in CrashReporter.js is the extension point for additional scrubbing.
- GDPR/privacy opt-out: set `VITE_CRASH_REPORTING_ENABLED=false` or call `window.__CRASH_REPORT_ENDPOINT__ = null` at runtime to disable for specific users.

---

## Acceptance

- [ ] Sentry project created, DSN set in production env
- [ ] Stage 3 rollout confirmed by on-call lead
- [ ] Dashboard widgets created in Sentry and linked from team wiki
- [ ] Alerting rules active in Sentry
