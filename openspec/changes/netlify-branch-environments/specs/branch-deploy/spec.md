## ADDED Requirements

### Requirement: Preview deploy on pull request
The system SHALL automatically deploy a preview build to Netlify when a pull request is opened or updated against the main branch.

#### Scenario: PR opened triggers preview deploy
- **WHEN** a pull request is opened against main
- **THEN** the CI job runs (lint, test, build) and upon success a preview deploy is published to Netlify

#### Scenario: PR updated triggers new preview deploy
- **WHEN** new commits are pushed to an open pull request branch
- **THEN** the CI job re-runs and upon success the preview deploy is updated

#### Scenario: CI failure prevents deploy
- **WHEN** the CI job (lint, test, or build) fails on a pull request
- **THEN** the deploy job SHALL NOT execute

### Requirement: Deploy URL posted as PR comment
The system SHALL post the Netlify preview deploy URL as a comment on the pull request after a successful deploy.

#### Scenario: Successful preview deploy comments URL
- **WHEN** a preview deploy completes successfully
- **THEN** a comment is added to the PR containing the preview URL

#### Scenario: Subsequent pushes update the comment
- **WHEN** a new preview deploy completes for the same PR
- **THEN** the existing deploy comment is updated with the new deploy URL rather than creating a duplicate comment

### Requirement: Predictable preview URL alias
The system SHALL use a predictable alias based on the PR number for preview deploys so the URL remains stable across pushes.

#### Scenario: PR number used as deploy alias
- **WHEN** a preview deploy is created for PR #42
- **THEN** the deploy alias SHALL be `deploy-preview-42`
