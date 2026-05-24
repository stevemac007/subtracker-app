Plan: SUB-172 — GCP Gmail OAuth setup
- Objective: Set up a Google Cloud Platform project, enable Gmail API, configure OAuth 2.0 credentials for subtimeapp@gmail.com, and establish secure secret storage for credentials.
- Scope: Create project, enable APIs, configure OAuth consent, create OAuth 2.0 client, wire secret storage, document and test flow.
- Assumptions: Access to Google Cloud Console or Cloud APIs; no Secrets stored in repo; Secret Manager or Vault can be used.
- Risks: Misconfigured redirect URIs; leaking client secrets; insufficient IAM permissions.
- Plan owner: CTO (you) and Subtime deployment team.
- Milestones:
  1) Create GCP project named paperclip-subtimeapp-gcp
  2) Enable Gmail API
  3) Configure OAuth consent screen
  4) Create OAuth 2.0 Client ID (Web application)
  5) Wire secure secret storage (Secret Manager / Vault)
  6) Document config and test flow; perform sandbox OAuth flow for subtimeapp@gmail.com
- Acceptance criteria:
  - Gmail API is accessible via OAuth for subtimeapp@gmail.com in a sandbox flow
  - No client secrets stored in repo; credentials stored securely
  - Documentation updated with steps and security notes
