# SubTracker Brand Guidelines

**Version:** 1.0
**Date:** 2026-05-04
**Owner:** CMO

---

## Product Name

- **Written:** SubTracker (camelCase, capital S and T)
- **All caps:** SUBTRACKER (for headers, buttons, CTAs)
- **Never:** subtracker, Subtracker, Sub-Tracker, Sub Tracker
- **Package name:** `subtracker` (in package.json)

---

## Taglines

| Context | Tagline |
|---------|---------|
| Campaign / Hero | "Built for the Bench" |
| Descriptive (SEO, manifest, OG) | "Basketball substitution tracker for coaches" |
| Short descriptor | "Basketball Substitution Tracking" |

---

## URLs

| Context | URL |
|---------|-----|
| Customer-facing (canonical) | `https://subtracker.app` |
| Internal / deployment | `https://subtracker.netlify.app` |

**Rule:** All marketing, social, email, and customer-facing materials use `subtracker.app`.

---

## Colors

| Name | Hex | Usage |
|------|-----|-------|
| Dark (court) | `#131009` | Primary background, header bar |
| Amber (gold) | `#f5a623` | Primary accent, CTAs, clock, highlights |
| Amber dim | `#a06b10` | Secondary accents, borders |
| Green | `#22c55e` | On-court indicators, confirm actions |
| Red | `#ef4444` | Out indicators, delete actions |
| Blue | `#60a5fa` | Bench indicators, neutral actions |
| Text | `#ede0cc` | Primary text on dark |
| Text dim | `#7a6548` | Secondary text, labels |
| Text mid | `#a8906c` | Tertiary text |
| Panel | `#1c1508` | Card/panel backgrounds |
| Panel border | `#332310` | Borders, dividers |
| Off-white (print) | `#faf6f0` | Print/flyer backgrounds |

---

## Typography

| Usage | Font | Weight | Notes |
|-------|------|--------|-------|
| Headers / Wordmark | Bebas Neue | 400 (default) | Letter-spacing: 2-4px |
| Body text | Inter | 400-700 | Primary reading font |
| Timers / Data | DM Mono | 400-500 | Clock times, court time, logs |

**Font loading:** Google Fonts CDN in GlobalStyles.jsx. Do not add additional fonts without discussion.

---

## Logo / Icon

- **Motif:** Basketball with "ST" monogram overlay
- **Background:** `#131009` rounded rectangle
- **Lines:** Amber `#f5a623` basketball seam lines
- **Text:** "ST" in amber, "SUBTRACKER" below in warm gray `#7a6548`
- **Files:**
  - `public/app-icon.svg` — primary SVG icon
  - `public/favicon.svg` — MUST match app-icon.svg (not Vite default)
  - `public/icon-192.png` — PNG for PWA
  - `public/icon-512.png` — PNG for PWA
  - `public/apple-touch-icon.png` — iOS home screen icon
  - `public/og-card.svg` — Open Graph social sharing card

---

## Tone of Voice

- **Coach-to-coach:** Speak as a fellow coach, not a corporation
- **Direct and practical:** No marketing fluff, no jargon
- **Empathetic:** Acknowledge the real stress of volunteer coaching
- **Data-backed:** Use numbers when available (62% admin stat, $38B market)
- **No hype:** Avoid "revolutionary," "game-changing," "disruptive"
- **First person OK:** "I built this because..." is preferred to "We are excited to announce..."

---

## Messaging Pillars

1. **Zero barriers** — No download, no account, no setup, no internet needed
2. **Fair playing time** — Objective court time data reduces parent conflicts
3. **Privacy-first** — All data stays on the coach's device, no server, no tracking
4. **Free to start** — One team free, $0.99 AUD per additional team
5. **Built for youth** — Designed specifically for volunteer youth coaches, not pros

---

## What We Are Not

- Not a full stats platform (no points, assists, rebounds tracking)
- Not a team management app (no scheduling, no payments, no messaging)
- Not for professional/college basketball (youth focus)
- Not a subscription product (one-time micro-payments only)

---

## Consistency Checklist

Before publishing any customer-facing material, verify:

- [ ] Product name: SubTracker (not subtracker, Subtracker, subtime)
- [ ] URL: subtracker.app (not subtracker.netlify.app)
- [ ] Primary colors: dark `#131009` + amber `#f5a623`
- [ ] Fonts: Bebas Neue for headers, Inter for body
- [ ] Tagline matches approved version
- [ ] Pricing matches current model (1 free team, $0.99 AUD/additional)
- [ ] No emoji in app UI (emoji OK in social media posts)
- [ ] Tone: coach-to-coach, not corporate
