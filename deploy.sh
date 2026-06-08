#!/bin/bash
set -e

cd /root/.openclaw/workspace/azizah-khairunnisa.github.io

# Build
pnpm run build

# Create a temp dir for gh-pages
TMPDIR=$(mktemp -d)
cp -r dist/* "$TMPDIR/"
cp dist/.nojekyll "$TMPDIR/" 2>/dev/null || true

# Switch to gh-pages branch
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages

# Remove everything except .git
find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# Copy built files
cp -r "$TMPDIR/"* .
rm -rf "$TMPDIR"

# Commit
git add -A
git commit -m "Deploy portfolio to GitHub Pages" --allow-empty

# Push
TOKEN=$(cat /root/.openclaw/workspace/.secrets/github-token)
git push "https://azizah-khairunnisa:${TOKEN}@github.com/azizah-khairunnisa/azizah-khairunnisa.github.io.git" gh-pages --force

# Go back to main
git checkout main

echo "✅ Deployed to gh-pages!"
