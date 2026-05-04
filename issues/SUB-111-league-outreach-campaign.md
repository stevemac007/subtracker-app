id: SUB-111
title: League coordinator outreach campaign
status: in_progress
priority: high
summary: Build a target list of 20 Australian youth basketball leagues and execute an initial outreach campaign using the existing league coordinator flyer.

owners:
- CMO (3f4e61df-2832-4219-946f-4340ea0b64a5)

dependencies:
- SUB-103
- marketing/flyer/league-coordinator-flyer.html (already exists)

tasks:
- task: Research and compile target list of 20 Australian youth basketball leagues/associations
  status: completed
  notes: "14 leagues identified with contacts (see research section). 7 out of 10 first-batch targets ready to contact."
- task: Find contact details (email, phone) for league coordinators or development officers
  status: completed
  notes: "12 contacts confirmed. Basketball NSW, Victoria, Queensland, SA, Wyndham, Banyule Hawks all have verified emails/phones."
- task: Draft outreach email sequence (initial, follow-up 1, follow-up 2)
  status: completed
  notes: "3-email sequence created in marketing/outreach-email-sequence.md with A/B subject lines and tracking spreadsheet."
- task: Customize flyer with any league-specific details if needed
  status: completed
  notes: "Flyer updated with real QR code pointing to subtracker.netlify.app (replaced placeholder SVG)."
- task: Send first batch of 10 outreach emails
  status: in_progress
  notes: "6 emails ready to send (BNSW, BV x2, BQ, Wyndham, Banyule). HTML email template created. Personalized send list in marketing/ready-to-send-batch-1.md. Tracking CSV created."
- task: Track responses and iterate messaging based on feedback
  status: pending

research:
  target_leagues:
  - name: Basketball NSW
    type: State Association
    url: https://bnsw.com.au/
    contact: info@bnsw.com.au | 02 8765 8555
    address: Unit 27, 11-21 Underwood Road, Homebush NSW 2140
    competitions: Waratah Junior Leagues (7 junior leagues), Waratah Senior League, NBL1 East
    notes: "Largest state association. Has 'Start an Association with Us' program. Coach Development page exists."
  - name: Basketball Victoria
    type: State Association
    url: https://basketballvictoria.com.au/
    contact: enquiries@basketballvictoria.com.au | +61 3 9837 8000
    address: State Basketball Centre, 291 George Street, Wantirna South VIC 3152
    competitions: VJBL (1200+ teams from 54 associations), Big V (140+ teams), Country Basketball League
    notes: "VJBL has 54 member associations — each is a potential outreach target. Key contacts: Rob Coulter (Coach Development Officer), Rebecca McIntyre & Chris Gorrie (Association Development Officers), coaching@basketballvictoria.com.au. CEO: Nick Honey (nick.honey@basketballvictoria.com.au)."
  - name: Basketball Queensland
    type: State Association
    url: https://www.queensland.basketball/
    contact: admin@basketballqld.net.au | (07) 2113 4835 | (07) 3377 9100
    address: Logan Metro Sports & Events Centre, 357 Browns Plains Rd, Crestmead QLD 4132
    notes: "Coach Development Manager: Luke McGuire (coachdev@basketballqld.net.au, 0412 080 677). Basketball Development Officer: Patrick McInerney (patrick.mcinerney@basketballqld.net.au, 0404 112 689)."
  - name: Basketball SA
    type: State Association
    url: https://basketballsa.com.au/
    contact: (08) 7088 0070 | Contact form at basketballsa.com.au/contact-us/
    address: Building 3, Level 1, 32-56 Sir Donald Bradman Drive, Mile End SA 5031
    notes: "CEO: Tim Brenton (tim.brenton@basketballsa.com.au). Community Development Manager: Bryn Loots. 15+ affiliated clubs with direct emails (see Club Contacts page)."
  - name: Basketball WA
    type: State Association
    url: https://basketballwa.net/
    contact: To be found
    notes: "Next priority for contact research."
  - name: Basketball Tasmania
    type: State Association
    url: https://basketballtas.com.au/
    contact: To be found
  - name: Basketball ACT
    type: State Association
    url: https://basketballact.com.au/
    contact: To be found
  - name: Basketball NT
    type: State Association
    url: To be found
    contact: To be found
  - name: Basketball Australia (National)
    type: National Body
    url: https://www.australia.basketball/
    contact: info@australia.basketball | marketing@australia.basketball
    address: State Basketball Centre, 291 George Street, Wantirna South VIC 3152
    notes: "National body — partnership here unlocks all state associations. Has NextPlay coaching network."
  - name: Wyndham Basketball (VIC)
    type: Local Association
    url: https://wyndhambasketball.com/
    contact: rep@wyndhambasketball.com | 0447 934 512
    notes: "VJBL member. Over 40 junior teams. Director of Coaching structure."
  - name: Banyule Hawks (VIC)
    type: Local Club
    url: https://banyulehawks.com.au/
    contact: info@banyulehawks.com.au | 0423 927 508
    notes: "EDJBA member. Has Coach Handbook with substitution guidance page — perfect SubTracker fit."
  - name: Southern Peninsula Basketball Association (VIC)
    type: Local Association
    url: beachcombersbasketball.club
    contact: To be found
    notes: "Has coaching resources page with substitution spreadsheet — SubTracker could replace this."
  - name: BMBA Basketball Academy (VIC)
    type: Academy/Club
    url: https://bmba.net.au/
    contact: Bob Mann (via website)
    notes: "Growing junior program. Recently restarted Friday matches. Actively recruiting coaches."
  - name: Eastern Districts Junior Basketball Association (VIC)
    type: Junior Association
    url: To be found
    contact: To be found
    notes: "Multiple clubs compete in EDJBA (Banyule Hawks, Whitehorse Mustangs). Large coach base."

acceptance_criteria:
- Target list of 20 leagues with contact details documented
- Email sequence drafted and ready
- First 10 outreach emails sent
- Response rate tracked (target: 20%+ reply rate)
- At least 1 league expresses interest in pilot

objective:
Secure at least one pilot league willing to roll out SubTracker to their coaches, providing a multi-user beachhead and case study for further outreach.

next_action:
- Send first 5 emails immediately: Basketball NSW, Basketball Victoria (enquiries + coaching), Basketball Queensland, Wyndham Basketball, Banyule Hawks
- Submit contact form for Basketball SA
- Find contacts for Basketball WA, ACT, and local clubs (Southern Peninsula, BMBA)
- Send remaining 5 emails once contacts found
- Set up follow-up reminders (5-7 days after initial email)
