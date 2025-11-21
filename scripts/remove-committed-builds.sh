#!/usr/bin/env bash
set -euo pipefail

# This script removes tracked build artifacts and common env files from the current branch
# It must be run locally in a clone of the repository where you have push access.
# Usage: ./scripts/remove-committed-builds.sh

echo "Removing tracked .next and .netlify directories (if present) from index..."
# Remove from index (cached) so files remain locally but are untracked and removed from next commit
git rm -r --cached .next || true
git rm -r --cached .netlify || true

# Remove common .env files from index if they were committed
git rm --cached .env || true
# Attempt to remove any other .env.* files
for f in $(git ls-files | grep -E '^\.env(\.|$)' || true); do
  git rm --cached "$f" || true
done

# Create/update .gitignore to prevent re-adding build outputs
cat > .gitignore <<'EOF'
.next/
.netlify/
.env
.env.local
.env.*
node_modules/
.DS_Store
EOF

# Stage changes and commit
git add .gitignore || true
# If any files were removed from the index, add and commit those deletions too
git add -A || true

# Only commit if there are changes
if git diff --cached --quiet; then
  echo "No changes to commit. Exiting."
  exit 0
fi

git commit -m "Remove committed build artifacts and ignore them (.next, .netlify, .env)"

echo "Pushing commit to origin (current branch)..."
git push origin HEAD

echo "Done. Please follow README_CLEANUP.md to purge history if secrets were previously committed."