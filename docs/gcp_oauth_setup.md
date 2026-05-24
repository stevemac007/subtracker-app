# GCP Gmail OAuth Setup (SUB-172)
- Purpose: Outline steps to create a GCP project, enable Gmail API, and configure OAuth 2.0 credentials for subtimeapp@gmail.com.
- Do not commit client secrets. Use secure secret storage.

## Steps
1) Create Google Cloud Project
- Name: paperclip-subtimeapp-gcp
- Organization: Paperclip
- Billing: Enable

2) Enable APIs
- Gmail API

3) OAuth Consent Screen
- User type: External
- App name: Paperclip Subtimeapp
- Support email: admin@example.com
- Scopes: https://www.googleapis.com/auth/gmail.readonly (and any other required scopes)

4) OAuth 2.0 Credentials
- Create OAuth 2.0 Client ID (Web application)
- Authorized redirect URIs: https://your-app-domain/oauth2callback
- Do not expose client_secret in the repo; store securely (Secret Manager, Vault, etc.)
- Note client_id and client_secret for internal use only

6) Secrets storage
- Do not commit secrets. Use Secret Manager, Vault, or equivalent secret storage.
- Bind credentials to the application's runtime configuration via environment variables or a secret store.
- Implement rotation and auditing of credentials.

5) Testing
- Run a test OAuth flow in a safe sandbox using subtimeapp@gmail.com
