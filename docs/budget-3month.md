# SubTracker — 3-Month Budget & Path to Net-Zero Cashflow

**Date:** 2026-05-04
**Owner:** CMO
**Issue:** SUB-40

---

## Product Summary

| Attribute | Detail |
|-----------|--------|
| Product | SubTracker — basketball substitution tracker for coaches & scorekeepers |
| Platform | Browser-based SPA (React 19 + Vite 8), offline-capable via sql.js |
| Backend | None — all data in browser localStorage |
| Hosting | Netlify (free tier sufficient for launch) |
| Current monetization | None (free, no limits) |
| Target users | Youth/high school/AAU basketball coaches, assistants, scorekeepers |
| Market size (US) | ~1M youth coaches, ~700K HS players, ~100K AAU coaches |

---

## 3-Month Budget (Months 1–3 from launch)

### Infrastructure Costs

| Item | Monthly | 3-Month Total | Notes |
|------|---------|---------------|-------|
| Domain (subtracker.app or similar) | — | $12 | One-time registration (~$12/yr) |
| Netlify hosting | $0 | $0 | Free tier: 100GB/mo bandwidth, 300 build min — sufficient |
| Custom domain on Netlify | $0 | $0 | Included on free tier |
| SSL (Let's Encrypt) | $0 | $0 | Auto via Netlify |
| **Infrastructure subtotal** | **~$1/mo** | **$12** | |

### Operating Costs

| Item | Monthly | 3-Month Total | Notes |
|------|---------|---------------|-------|
| Google Workspace (email) | $0 | $0 | Use free forwarding at launch; add later if needed |
| Analytics (Plausible / GA4) | $0 | $0 | GA4 free; Plausible free tier < 10K events |
| Error monitoring | $0 | $0 | No backend; browser errors logged to console at launch |
| **Operating subtotal** | **$0** | **$0** | |

### Marketing & Growth Costs

| Item | Month 1 | Month 2 | Month 3 | 3-Month Total | Notes |
|------|---------|---------|---------|---------------|-------|
| Demo video production | $0 | — | — | $0 | Use existing screenshots + free tools (CapCut/iMovie) |
| Social ads (Meta/FB/IG) | $100 | $150 | $200 | $450 | Target: basketball coaches, youth sports parents |
| Google Ads (search) | $50 | $100 | $150 | $300 | Keywords: "basketball substitution tracker", "court time tracker" |
| Content creation (tools) | $0 | — | — | $0 | Free tier Canva, open-source tools |
| Community outreach | $0 | — | — | $0 | Reddit, coach forums, Facebook groups — organic |
| Influencer/sample licenses | $50 | $50 | $50 | $150 | Free licenses to coach influencers for testimonials |
| **Marketing subtotal** | **$200** | **$300** | **$400** | **$900** | |

### One-Time / Launch Costs

| Item | Cost | Notes |
|------|------|-------|
| Domain registration | $12 | .app or .com |
| App store listing (if PWA) | $0 | PWA doesn't require store fees |
| Legal (terms, privacy policy) | $0 | Template-based at launch |
| **One-time subtotal** | **$12** | |

---

## Total Budget Summary

| Category | 3-Month Total |
|----------|---------------|
| Infrastructure | $12 |
| Operating | $0 |
| Marketing & Growth | $900 |
| One-Time | $12 |
| **TOTAL SEED CAPITAL REQUIRED** | **$924** |

**Round up to $1,000** for buffer and unplanned spend.

---

## Monetization Strategy

### Pricing Model: Freemium SaaS

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Full substitution tracking, roster management, game clock, stats, game log — all browser-local |
| **Coach Pro** | $4.99/mo or $39.99/yr | Cloud sync (multi-device), team sharing, season stats export (CSV/PDF), advanced analytics (lineup effectiveness, player rotation heat maps), priority support |
| **Team/League** | $19.99/mo | Up to 10 coaches on shared roster, league-wide scheduling, admin dashboard, custom branding |

### Why Freemium?
- Free tier is the product's strongest distribution channel — no friction, works offline, no account required
- Power users (coaches running full seasons) will need cloud sync and analytics
- Team/league tier captures organizational budgets (not individual coach budgets)

---

## Revenue Projections — Path to Net-Zero by Month 3

### Traffic Model (conservative)

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Paid ad impressions | 25,000 | 40,000 | 60,000 |
| Click-through rate | 2% | 2.5% | 3% |
| Site visits (paid) | 500 | 1,000 | 1,800 |
| Organic visits | 100 | 300 | 700 |
| **Total visits** | **600** | **1,300** | **2,500** |
| Signup-to-active rate | 40% | 45% | 50% |
| **Active users** | **240** | **585** | **1,250** |

### Conversion Model

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Free active users | 228 | 550 | 1,175 |
| Coach Pro conversion rate | 5% | 6% | 7% |
| **Coach Pro subscribers** | **12** | **35** | **88** |
| Team/League conversion rate | 0.5% | 1% | 1.5% |
| **Team/League accounts** | **1** | **5** | **19** |
| **Monthly recurring revenue (MRR)** | **$80** | **$555** | **$819** |

### Cashflow Analysis

| Metric | Month 1 | Month 2 | Month 3 | **Cumulative** |
|--------|---------|---------|---------|----------------|
| Revenue | $80 | $555 | $819 | **$1,454** |
| Spend | $200 | $300 | $400 | **$900** |
| One-time (domain) | $12 | $0 | $0 | **$12** |
| **Net (monthly)** | **-$132** | **+$255** | **+$419** | |
| **Cumulative net** | **-$132** | **+$123** | **+$542** | |

### Result: **Net-zero reached in Month 2** (cumulative), with **+$542 positive by end of Month 3** on $1,000 seed.

---

## Key Assumptions & Risks

### Assumptions
1. Paid ads achieve 2-3% CTR targeting basketball coaching interests (benchmarked against Meta sports niche average of 1.5-3%)
2. 5-7% free-to-paid conversion (conservative; SaaS average is 3-8%, sports tools trend higher due to clear utility)
3. $4.99/mo price point (validated against competitor pricing: HomeCourt $9.99/mo, Hudl $10-30/mo for basic)
4. No significant development costs in 3-month window (team is agent-built, no contractor spend)
5. Seasonal timing aligned with basketball season (fall/winter for HS/AAU; spring for youth leagues)

### Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low ad CTR (< 1%) | High — slower user acquisition | A/B test creatives; pivot to organic (coach forums, Reddit, Facebook groups) |
| Conversion rate < 3% | Medium — delays net-zero | Add in-app prompts at "aha moment" (after first game); free trial of Pro features |
| Seasonal miss | High — basketball is seasonal | Launch before season starts; target summer leagues/AAU if HS season missed |
| Competitor response | Low — most competitors are expensive, complex | Position as "simple, free, works offline" — opposite of bloated alternatives |
| Churn > 10%/mo | Medium — erodes MRR | Seasonal lock-in (season data); annual plan discount; regular feature updates |

---

## Growth Channels (Prioritized)

### Tier 1 — Immediate (Month 1)
1. **Organic community outreach** — Reddit (r/coaches, r/basketball), Facebook coach groups, Discord servers
2. **Demo video** — Use existing screenshot assets; assemble with CapCut; share on YouTube, Twitter/X
3. **Product Hunt launch** — Free, high-intent audience; coordinate with CTO for technical story

### Tier 2 — Paid (Month 1-2)
4. **Meta ads (FB/IG)** — Target: job title "coach", interests "basketball coaching", "youth sports"
5. **Google Search ads** — Bid on long-tail: "basketball substitution tracker", "player court time app"

### Tier 3 — Scale (Month 2-3)
6. **Coach influencer partnerships** — Free Pro accounts for testimonials and social sharing
7. **League partnerships** — Direct outreach to youth basketball leagues for bulk Team/Plan licenses
8. **Referral program** — "Give 1 month, get 1 month" for existing Pro users

---

## Next Actions

| # | Action | Owner | Timeline |
|---|--------|-------|----------|
| 1 | Register domain (subtracker.app or subtracker.io) | CEO | Week 1 |
| 2 | Assemble demo video from existing screenshot assets | CMO | Week 1 |
| 3 | Set up GA4 analytics and conversion tracking | CTO | Week 1 |
| 4 | Define Coach Pro feature spec (cloud sync requirements) | CTO + CMO | Week 1-2 |
| 5 | Launch Meta ads campaign (budget: $100/mo start) | CMO | Week 2 |
| 6 | Launch Google Ads campaign (budget: $50/mo start) | CMO | Week 2 |
| 7 | Product Hunt launch preparation | CMO + CTO | Week 2-3 |
| 8 | Implement in-app upgrade prompts | CTO | Week 3-4 |
| 9 | Outreach to 20+ coach influencers for testimonials | CMO | Month 2 |
| 10 | League partnership outreach (5 leagues target) | CMO | Month 2-3 |

---

## Budget Guardrails

- **Monthly burn cap:** $400/mo (Month 3 max). If CAC > $5/user by end of Month 2, pause paid ads and pivot to organic.
- **Revenue checkpoint:** Must hit $200 MRR by end of Month 2 or revise pricing/packaging.
- **Pause trigger:** If cumulative spend exceeds $1,500 without $500+ cumulative revenue, pause all paid spend and escalate to CEO for strategy review.
