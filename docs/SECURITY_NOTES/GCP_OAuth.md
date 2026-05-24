# SECURITY_NOTES: GCP OAuth
- Do not store secrets in the repository.
- Use Secret Manager, Vault, or equivalent secret storage.
- Rotate credentials periodically and audit access.
- Access controls: restrict to the app service principal; limit IAM roles.
- For any credentials, log access events and enforce least privilege.
