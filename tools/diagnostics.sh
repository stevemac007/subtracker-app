#!/usr/bin/env bash
set -euo pipefail

echo "=== Diagnostics ==="
echo "Node version: $(node -v 2>/dev/null || echo 'not installed')"
echo "NPM version: $(npm -v 2>/dev/null || echo 'not installed')"
echo "Yarn version: $(yarn -v 2>/dev/null || echo 'not installed')"
echo "Playwright version: $(npx playwright --version 2>/dev/null || echo 'not installed')"
echo "OS: $(uname -a)"
echo "Working dir: $(pwd)"
echo "Listing repo state..."
ls -la
echo "=== End Diagnostics ==="
