````markdown
```markdown
# Cleaning committed build artifacts and secrets (safe steps)

This repository contained committed build artifacts (like .next/.netlify) which triggered Netlify's secrets scanner. The safest course is to remove those tracked artifacts and, if any sensitive values were committed, purge them from history and rotate the keys.

1) Run the helper script locally

- Clone your repo locally and checkout the branch you want to fix (e.g., netlify-deploy):

  git clone https://github.com/freewebsite350-rgb/studio.git
  cd studio
  git checkout netlify-deploy

- Run the helper script which untracks .next/.netlify and adds .gitignore:

  chmod +x ./scripts/remove-committed-builds.sh
  ./scripts/remove-committed-builds.sh

This will create a commit that removes the tracked build outputs and pushes it to the remote branch.

2) Purge secrets from history (if you accidentally committed secrets)

If any secrets (API keys, tokens, .env files) were committed to the git history, you should purge them and rotate the keys. Two common tools are BFG and git-filter-repo.

A) Using the BFG Repo-Cleaner (simpler):

- Backup & mirror clone:
  git clone --mirror https://github.com/freewebsite350-rgb/studio.git repo-mirror.git
  cd repo-mirror.git

- Use the BFG to remove files matching patterns (example removes .env files):
  # Download BFG jar: https://rtyley.github.io/bfg-repo-cleaner/
  java -jar bfg.jar --delete-files ".env" --delete-files ".env.local" --no-blob-protection

- Clean up and push:
  git reflog expire --expire=now --all && git gc --prune=now --aggressive
  git push --force

B) Using git-filter-repo (recommended for more control):

- Install: pip install git-filter-repo
- Mirror clone and run:
  git clone --mirror https://github.com/freewebsite350-rgb/studio.git repo-mirror.git
  cd repo-mirror.git
  # Example: remove all .env files from history
  git filter-repo --invert-paths --paths .env --paths .env.local --force
  git push --force

Important: Rewriting history requires force pushes and will change commit SHAs. Coordinate with collaborators, and instruct them to re-clone or reset their local copies.

3) Rotate any keys that may have been exposed

- For any potentially leaked API keys or tokens, rotate them in the provider console (Firebase, Facebook, etc.). Do not reuse the same secret.

4) Re-deploy on Netlify

- After removing committed artifacts and purging history if needed, merge the fixed branch into main and trigger a fresh Netlify build. Ensure the required environment variables are set in Netlify.

Security notes

- Never commit .env files or build artifacts with embedded secrets.
- Keep production secrets in Netlify environment variables, GitHub Secrets, or a secret manager.
```
````