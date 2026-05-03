# Backend Scaffold

A small Express-based scaffold to begin modeling the Paperclip Pro Tier backend architecture (payments, auth, feature gating).

Usage:
- Set environment variables to toggle features, e.g.
  - FEATURE_PAYMENTS_ENABLED=true
  - FEATURE_AUTH_ENABLED=true
  - PORT=3001
- Start: node backend/server.js (or via npm script if added to root package.json)

Endpoints:
- GET /payments/health
- POST /payments/charge
- GET /auth/health
