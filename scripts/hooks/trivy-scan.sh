#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if ! command -v trivy >/dev/null 2>&1; then
  echo "Trivy is required but not installed."
  echo "Install: brew install trivy"
  echo "Docs: https://aquasecurity.github.io/trivy/"
  exit 1
fi

echo "Running Trivy filesystem vulnerability scan..."

trivy fs \
  --config trivy.yaml \
  --scanners vuln \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  --ignore-unfixed \
  .

echo "Trivy scan passed for mobile app dependencies (no HIGH/CRITICAL unfixed vulnerabilities)."

if [[ -f functions/package-lock.json ]]; then
  echo ""
  echo "Note: functions/package-lock.json has separate dependencies."
  echo "Run 'cd functions && npm audit' to review Cloud Functions vulnerabilities."
fi
