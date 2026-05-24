# PLAN: SUB-172
- Objective: Enable Gmail API access for subtimeapp@gmail.com via a GCP project and OAuth 2.0 credentials.
- Milestones:
  1. Create GCP project and enable Gmail API.
  2. Configure OAuth consent screen and OAuth 2.0 client.
  3. Provide credentials to app and test access.
  4. Document the process and store credentials securely.
- Risks:
  - Secrets exposure if credentials are mishandled.
  - Incorrect OAuth configuration could block access.
- Success criteria:
  - Gmail API calls succeed using OAuth credentials for the app.
