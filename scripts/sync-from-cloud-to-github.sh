#!/usr/bin/env bash
# Run inside ~/daily-impact-prioritizer on your Mac (empty GitHub clone).
set -euo pipefail

CURSOR_ORIGIN="${CURSOR_ORIGIN:-https://origin.cursor.com/git/iterable/tmp-91a8fcb443a6e6fb.git}"
GITHUB_URL="${GITHUB_URL:-https://github.com/rbiehn2025/daily-impact-prioritizer.git}"

cd "$(git rev-parse --show-toplevel)"

if ! git remote get-url origin | grep -q github.com; then
  echo "Expected origin to be your GitHub repo; got: $(git remote get-url origin)"
  exit 1
fi

if ! git remote get-url cursor &>/dev/null; then
  git remote add cursor "$CURSOR_ORIGIN"
fi

echo "Fetching main from cloud Origin..."
git fetch cursor main
git merge cursor/main --allow-unrelated-histories -m "Import daily impact prioritizer from cloud agent"

echo "Pushing to GitHub..."
git push -u origin main
echo "Done. GitHub should now match cloud main."
