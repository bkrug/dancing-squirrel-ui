#!/usr/bin/env bash
# Runs the Jest test suite with coverage and opens the HTML report in a browser.
set -euo pipefail

cd "$(dirname "$0")"

# Which files are included in coverage is set by "collectCoverageFrom" in package.json.
npx react-scripts test --coverage --watchAll=false

report="coverage/lcov-report/index.html"
if command -v xdg-open > /dev/null; then
  xdg-open "$report"
elif command -v open > /dev/null; then
  open "$report"
else
  echo "Coverage report written to $report"
fi
