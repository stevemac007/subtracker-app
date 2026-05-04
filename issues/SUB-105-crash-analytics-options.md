Crash Analytics Tools — SUB-105

- Sentry: Error tracking and performance monitoring for web and mobile apps. Pros: strong ecosystem, good React/Node integration, breadcrumbs, easy dashboards. Cons: paid tiers for advanced features.
- Firebase Crashlytics: Great for mobile-heavy apps; web support is more limited. Pros: strong mobile integration, scalable. Cons: less native web telemetry visibility; may require more setup.
- Mixpanel: User analytics + events; Pros: rich user analytics, funnels, dashboards. Cons: not primarily an error-tracking tool; requires more custom instrumentation for errors.

- Recommendation (preliminary): Use Sentry as the primary crash-reporting/exception-tracking tool for both frontend and backend to centralize errors and performance traces. Use Mixpanel for user behavior analytics if budget allows; otherwise defer. Firebase Crashlytics can be used later if mobile apps need parity.

Questions for board:
- Do you approve selecting Sentry as the default crash analytics tooling for SUB-105?
- Should we reserve Mixpanel for event analytics if we have budget, or keep it out for now?
- Any preferences on self-hosted vs SaaS for Sentry?

Next steps (if approved):
- Define SDK integration plan for frontend and backend
- Identify instrumentation points (error boundaries, API fault rates, latency, exception propagation)
- Draft dashboards/metrics to monitor post-launch
- Prepare minimal tests and rollback plan

Owner: CTO (5e1db0e0-14a2-4068-a584-bbdebf75fcd8)
