# Referral Program — SubTracker

## Program Name
"Share the Bench"

## Mechanics

### Reward
- Referrer: Gets 1 free additional team slot (normally AUD $0.99) for each coach who creates their first game
- Referred coach: Gets a free first season (no paid teams required)
- Cap: Maximum 10 free team slots per referrer
- Eligibility: Must have created at least 1 game to generate a referral link

### How It Works
1. Coach finishes a game, sees prompt: "Know another coach? Share SubTracker and get a free team slot."
2. Coach taps share — generates link: `subtracker.netlify.app/?ref=SESSION_ID`
3. New coach opens link, creates their first game — referrer is credited
4. Referrer gets a notification (in-app toast) when a referral signs up
5. Free team slots apply automatically to their next game

### Tracking Approach (Option C — Recommended)
- URL parameter `?ref=SESSION_ID` stored on referred user's first game creation
- Lightweight POST to analytics endpoint: `/api/referral?code=SESSION_ID`
- No auth required, no personal data collected
- Session ID generated from localStorage UUID on first visit
- CTO must implement the lightweight analytics endpoint (no database, just a counter file or Netlify function)

## In-App Copy

### Share Prompt (appears after first completed game)
```
Know a coach who needs this?
Share SubTracker and you'll both get a free team slot.
[Share Link] [Not Now]
```

### Share Modal
```
Share SubTracker
Send this link to another coach. When they create their first game, you'll both get a free team slot.

[Copy Link]
[Share via WhatsApp]
[Share via Email]
[Share via Text]

Your referral link: subtracker.netlify.app/?ref=xxxxxxxx
```

### Referral Success Toast
```
Nice! [Coach] just signed up using your link. You've got a free team slot!
```

### Referral Status (settings/about page)
```
Referral Program
Share SubTracker with other coaches:
- You: 3 free team slots earned
- Coaches referred: 3
- Max slots: 10

[Share with a Coach]
```

## Landing Page Copy (if needed)

```
SubTracker — Free for You and a Friend

Share SubTracker with another coach. When they try it for the first time, you both get a free team slot.

No accounts. No setup. Just open the link and start tracking.

subtracker.netlify.app
```

## Email Template (for existing users)

**Subject:** "Get free team slots — share SubTracker with a coach you know"

**Body:**

Hey coach,

Quick favor — if you've found SubTracker useful, can you share it with another coach?

When they create their first game, you both get a free team slot (normally $0.99 AUD). No catch, no signup, just share the link.

Your personal link: subtracker.netlify.app/?ref=xxxxxxxx

Thanks for helping us grow. Built for the bench.

— The SubTracker Team

---

## Implementation Checklist

- [ ] CTO implements lightweight analytics endpoint for referral tracking
- [ ] Generate session-based UUID on first visit
- [ ] Add ?ref= parameter parsing on game creation
- [ ] Add share prompt after first completed game
- [ ] Add share modal with copy + native share options
- [ ] Add referral status display (settings/about page)
- [ ] Add success toast notification
- [ ] Test cross-device referral tracking
- [ ] Launch to all users

## Blocker
**Blocked on**: CTO to implement lightweight analytics endpoint for cross-device referral tracking.
**Unblock owner**: CTO
**Unblock action**: Implement POST /api/referral?code=XXX endpoint (can be a Netlify function, no database required — just append to a counter file or use Netlify's built-in analytics).
