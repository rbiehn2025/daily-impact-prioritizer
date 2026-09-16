#!/usr/bin/env bash
# Run on your laptop (or any host with GitHub auth), not in the cloud agent unless GitHub is integrated.
set -euo pipefail

GITHUB_URL="${1:-https://github.com/rbiehn2025/daily-impact-prioritizer.git}"

if ! git remote get-url github &>/dev/null; then
  git remote add github "$GITHUB_URL"
else
  git remote set-url github "$GITHUB_URL"
fi

if git ls-remote --heads github main 2>/dev/null | grep -q main; then
  echo "Remote main exists; pulling with rebase before push..."
  git fetch github main
  git rebase github/main
fi

git push -u github main
echo "Pushed to $GITHUB_URL (branch main)"
