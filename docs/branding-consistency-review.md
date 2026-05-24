# Branding Consistency Review — SubTracker

**Date:** 2026-05-04
**Owner:** CMO
**Issue:** SUB-195

---

## Executive Summary

SubTracker has a strong visual identity foundation (dark scoreboard aesthetic, amber/gold accent `#f5a623`, Bebas Neue typography, basketball motif). However, there are **12 inconsistencies** across code, marketing, and product surfaces. Three are critical and should be fixed immediately.

---

## Brand Identity Baseline (what's consistent)

| Element | Value | Status |
|---------|-------|--------|
| Product name | SubTracker / SUBTRACKER | ✅ Consistent |
| Primary color | `#f5a623` (amber/gold) | ✅ Consistent |
| Background | `#131009` (dark warm black) | ✅ Consistent |
| Primary font | Bebas Neue (headers) | ✅ Consistent |
| Secondary fonts | Inter (body), DM Mono (timers/data) | ✅ Consistent |
| Tagline concept | "Built for the bench" | ⚠️ Varies (see below) |
| Icon motif | Basketball with "ST" monogram | ✅ Consistent (flyer, OG card, app-icon) |

---

## Issues Found

### CRITICAL — Fix Immediately

#### 1. `package.json` name is `"subtime-app"`
- **Location:** `package.json:2`
- **Current:** `"name": "subtime-app"`
- **Expected:** `"name": "subtracker"`
- **Impact:** Build artifacts, npm metadata, any tooling that reads package name
- **Owner:** CTO

#### 2. `favicon.svg` is the default Vite purple lightning bolt
- **Location:** `public/favicon.svg`
- **Current:** Vite default icon (`#863bff` purple)
- **Expected:** SubTracker basketball icon (matching `app-icon.svg`)
- **Impact:** Browser tab icon, bookmarks, PWA shortcut — first visual touchpoint for every user
- **Owner:** CTO

#### 3. `index.css` ships unused Vite template styles
- **Location:** `src/index.css` (111 lines) + `src/App.css` (184 lines)
- **Current:** Default Vite React template CSS including purple accent `#aa3bff`, `.counter`, `.hero`, `#next-steps`, `#docs`, `#spacer` classes
- **Expected:** Empty or removed — GlobalStyles.jsx overrides everything the app actually uses
- **Impact:** Wasted bundle size, potential CSS conflicts, unprofessional if Vite landing ever renders
- **Owner:** CTO

---

### HIGH — Fix This Sprint

#### 4. Canonical URL inconsistency: `subtracker.app` vs `subtracker.netlify.app`
- **Locations:**
  - `subtracker.app`: social-media-posts.md, x-content-campaign-q2-2026.md, referral-program-design.md, blog-posts-q2-2026.md (usage notes)
  - `subtracker.netlify.app`: email-template-outreach-1.html, outreach-email-sequence.md, campaign-tracker-q2-2026.md
- **Expected:** Pick one canonical URL. If `subtracker.app` is the planned custom domain, use it everywhere but note the current live URL in internal docs
- **Owner:** CMO (can fix marketing docs now)

#### 5. Tagline varies across surfaces
- **manifest.json:** "Basketball substitution tracker for coaches"
- **OG card:** "BASKETBALL SUBSTITUTION TRACKER"
- **Flyer:** "Basketball Substitution Tracking — Built for Youth Leagues"
- **Campaign:** "Built for the Bench"
- **Email template:** "Basketball Substitution Tracking"
- **Expected:** Establish primary tagline + short form:
  - **Primary:** "Built for the Bench" (campaign tagline, most memorable)
  - **Descriptive:** "Basketball substitution tracker for coaches" (SEO, manifest, OG)
- **Owner:** CEO/CMO to approve, then CMO fixes materials

#### 6. Pricing model inconsistency (ads vs no ads)
- **Email template:** "$0.99 AUD per additional team. No subscriptions." (no mention of ads)
- **Flyer:** "Free tier supported by non-intrusive ads"
- **Blog posts:** "Be free. I'm a volunteer." implies completely free
- **Expected:** Clarify pricing model: is there an ad tier? If so, be consistent
- **Owner:** CEO to decide, CMO to update

---

### MEDIUM — Fix When Convenient

#### 7. Font mismatch in OG card and flyer vs app
- **OG card:** uses generic `sans-serif` for "SUBTRACKER" wordmark
- **Flyer SVG:** uses `sans-serif` for "ST" and "SUBTRACKER" text
- **App:** uses `'Bebas Neue'` for header title
- **Expected:** Use Bebas Neue in all brand assets (OG card SVG, flyer SVG)

#### 8. No brand guidelines document
- **Expected:** Create `docs/brand.md` with: colors, fonts, logo usage, taglines, tone of voice, URL convention
- **Owner:** CMO

#### 9. `apple-touch-icon.png` may not match brand
- **Location:** `public/apple-touch-icon.png`
- **Expected:** Verify it matches the basketball/amber icon, not a Vite default
- **Owner:** CTO

---

### LOW — Cleanup

#### 10. Leftover comment in HomeScreen.jsx
- **Location:** `src/screens/HomeScreen.jsx:8`
- **Current:** `// useMemo already imported above; keep single import`
- **Owner:** CTO

#### 11. Social media emoji usage vs app aesthetic
- **Instagram/Facebook posts:** use basketball emoji 🏀
- **App UI:** deliberately no emoji, clean scoreboard aesthetic
- **Expected:** Decide if emoji is acceptable in social posts (likely fine — different context)
- **Owner:** CMO

#### 12. Flyer uses HTML entities for icons (✅🔒📶⚡)
- **Location:** `marketing/flyer/league-coordinator-flyer.html`
- **Impact:** Emoji rendering varies across devices/printers; may look different in print
- **Expected:** Use SVG icons or confirm emoji renders consistently in print
- **Owner:** CMO

---

## Action Plan

| # | Priority | Action | Owner | Status |
|---|----------|--------|-------|--------|
| 1 | CRITICAL | Fix package.json name to "subtracker" | CTO | Pending delegation |
| 2 | CRITICAL | Replace favicon.svg with basketball icon | CTO | Pending delegation |
| 3 | CRITICAL | Remove/clean Vite template CSS | CTO | Pending delegation |
| 4 | HIGH | Standardize to `subtracker.app` in all marketing | CMO | In progress |
| 5 | HIGH | Approve and standardize tagline | CEO | Pending decision |
| 6 | HIGH | Clarify ad/pricing model | CEO | Pending decision |
| 7 | MEDIUM | Update OG card SVG to use Bebas Neue | CMO | Can do |
| 8 | MEDIUM | Create brand guidelines document | CMO | In progress |
| 9 | MEDIUM | Verify apple-touch-icon.png | CTO | Pending delegation |

---

## CEO Decisions Needed

1. **Canonical URL:** Is `subtracker.app` our domain? If yes, use it in all marketing. If not, standardize on `subtracker.netlify.app`.
2. **Tagline:** Approve "Built for the Bench" as primary campaign tagline.
3. **Pricing model:** Confirm whether free tier includes ads. Current materials conflict.

---

## Next Action

1. Fix all marketing files using `subtracker.netlify.app` → `subtracker.app` (CMO can do now)
2. Create `docs/brand.md` brand guidelines (CMO)
3. Delegate code fixes (package.json, favicon, CSS cleanup) to CTO via child issues
4. Request CEO decisions on URL, tagline, and pricing model
