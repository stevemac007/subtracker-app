# Branding Consistency Audit — SubTracker

**Date:** 2026-05-04
**Author:** CMO
**Status:** In Progress — Critical fixes identified

---

## Brand Identity (Canonical)

| Element | Value | Notes |
|---------|-------|-------|
| **Product Name** | SubTracker | CamelCase in prose, ALL CAPS in logos/wordmarks |
| **Primary Color** | `#f5a623` (Gold/Amber) | Used for CTAs, accents, highlights |
| **Secondary Color** | `#131009` (Dark) | Backgrounds, headers, text |
| **Tertiary Colors** | `#7a6548` (Warm Gray), `#faf6f0` (Off-white) | Supporting text, backgrounds |
| **Status Colors** | `#22c55e` (Green = on court), `#60a5fa` (Blue = bench), `#ef4444` (Red = out) | Functional only |
| **Primary Font** | Bebas Neue | Headings, wordmarks, UI labels |
| **Secondary Font** | DM Mono | Clock, timers, data display |
| **Body Font** | Inter | Body text, descriptions |
| **Tagline** | "Basketball substitution tracker for coaches" | Canonical short form |
| **Domain** | subtracker.app | Canonical customer-facing URL (per brand.md) |
| **Deployment URL** | subtracker.netlify.app | Internal / current hosting |

---

## Findings

### CRITICAL — Must Fix

#### 1. favicon.svg uses Vite default purple branding
- **File:** `public/favicon.svg`
- **Issue:** Contains `#863bff` / `#7e14ff` (Vite purple), completely wrong brand colors
- **Impact:** Browser tab, bookmarks, and PWA install show purple lightning bolt instead of SubTracker basketball icon
- **Fix:** Replace with app-icon.svg or a simplified basketball/ST icon using brand colors

#### 2. Default Vite CSS files still present with wrong branding
- **Files:** `src/index.css`, `src/App.css`
- **Issue:** Contains `--accent: #aa3bff` (purple) and default Vite template styles
- **Impact:** If any component accidentally inherits from these, wrong colors appear. Dead code that creates confusion.
- **Fix:** Clean up or remove; the app uses `GlobalStyles.jsx` exclusively

#### 3. Domain inconsistency across all marketing materials
- **Issue:** Mixed use of `subtracker.app` (canonical per brand.md) and `subtracker.netlify.app` (deployment URL)
  - Was found in: email-template-outreach-1.html, blog-posts-q2-2026.md (usage notes)
- **Impact:** Confusing for users, undermines brand professionalism
- **Fix:** Standardized to `subtracker.app` across all marketing materials (FIXED)

### HIGH — Should Fix

#### 4. No brand guide document
- **Issue:** Brand colors, fonts, and tone scattered across files with no single source of truth
- **Fix:** This document serves as the brand guide; keep it updated

#### 5. Tagline inconsistency
- **Where it appears:**
  - `manifest.json`: "Basketball substitution tracker for coaches"
  - `index.html` (og:description): "Basketball substitution tracker for coaches"
  - Flyer: "Basketball Substitution Tracking — Built for Youth Leagues"
  - Email template: "Basketball Substitution Tracking"
  - README: "A basketball substitution tracker built for coaches and scorekeepers"
- **Fix:** Standardize on one primary tagline

#### 6. Brand name casing inconsistency
- **Issue:** "SubTracker" (CamelCase) in prose, "SUBTRACKER" (ALL CAPS) in logos/headers — this is actually correct usage, but needs documentation
- **Fix:** Document the convention (done above)

#### 7. Email signature is generic
- **File:** `email-template-outreach-1.html`
- **Issue:** Signed "The SubTracker Team" — feels corporate for a personal tool
- **Fix:** Use a personal signature or founder name

### MEDIUM — Nice to Fix

#### 8. Landing page CSS uses system fonts
- **File:** `src/index.css`
- **Issue:** Uses `system-ui` and `Segoe UI` instead of brand fonts
- **Impact:** Only affects the default Vite landing page (which isn't the actual app UI)
- **Fix:** Low priority since the actual app uses GlobalStyles.jsx

#### 9. Apple touch icons may not match brand
- **Files:** `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`
- **Issue:** Need to verify these match the app-icon.svg branding (basketball + ST)
- **Fix:** Generate from app-icon.svg if they don't match

#### 10. Social media hashtag inconsistency
- **Issue:** Different hashtag sets across different social posts
- **Fix:** Standardize on core hashtag set: `#BasketballCoaching #YouthBasketball #SubTracker #BuiltForTheBench`

---

## Fix Priority Order

1. ✅ Replace favicon.svg with branded icon — DONE
2. ✅ Clean up default Vite CSS files — DONE
3. ✅ Standardize domain across all marketing materials — DONE
4. ✅ Standardize tagline in README — DONE
5. ⏳ Verify/regenerate PNG icons from SVG — DELEGATED to CTO (SUB-195-A)
6. ✅ Update email template signature — DONE

---

## Next Actions

- [x] Create replacement favicon.svg using brand colors
- [x] Remove or clean up src/index.css and src/App.css
- [x] Audit and update all domain references (standardized to subtracker.app)
- [x] Update tagline in README
- [ ] Check PNG icons match SVG branding → Delegated to CTO (SUB-195-A)
- [x] Update email template signature
