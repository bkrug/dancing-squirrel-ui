#!/usr/bin/env bash
# Runs the Jest test suite with coverage and opens the HTML report in a browser.
set -euo pipefail

cd "$(dirname "$0")"

args=()
while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" == \#* ]] && continue
  args+=("--collectCoverageFrom=$line")
done < coverage-patterns.txt

npx react-scripts test --coverage --watchAll=false "${args[@]}"

report="coverage/lcov-report/index.html"
if command -v xdg-open > /dev/null; then
  xdg-open "$report"
elif command -v open > /dev/null; then
  open "$report"
else
  echo "Coverage report written to $report"
fi
