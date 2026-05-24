## ADDED Requirements

### Requirement: Production deploy on merge to main
The system SHALL automatically deploy to Netlify production when commits are pushed to the main branch (including PR merges).

#### Scenario: Merge to main triggers production deploy
- **WHEN** a pull request is merged to main
- **THEN** the CI job runs and upon success a production deploy is published to Netlify

#### Scenario: Direct push to main triggers production deploy
- **WHEN** a commit is pushed directly to main
- **THEN** the CI job runs and upon success a production deploy is published to Netlify

#### Scenario: CI failure prevents production deploy
- **WHEN** the CI job fails on a push to main
- **THEN** the production deploy job SHALL NOT execute

### Requirement: Netlify configuration in repository
The system SHALL include a root-level `netlify.toml` that defines build command, publish directory, and SPA redirect rules.

#### Scenario: netlify.toml defines build settings
- **WHEN** Netlify processes the repository
- **THEN** it SHALL use `npm run build` as the build command and `dist` as the publish directory

#### Scenario: SPA routing redirect configured
- **WHEN** a request is made to any path that does not match a static file
- **THEN** Netlify SHALL serve `index.html` with a 200 status code

### Requirement: Credentials stored as GitHub secrets
The system SHALL use GitHub repository secrets for Netlify authentication, never hardcoded values.

#### Scenario: Auth token from secrets
- **WHEN** the deploy workflow runs
- **THEN** it SHALL read `NETLIFY_AUTH_TOKEN` from GitHub secrets

#### Scenario: Site ID from secrets
- **WHEN** the deploy workflow runs
- **THEN** it SHALL read `NETLIFY_SITE_ID` from GitHub secrets
