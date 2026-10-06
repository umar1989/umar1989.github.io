#!/usr/bin/env bash
# Commit and push any changes so GitHub Pages updates.
cd "$(dirname "$0")" || exit 1
git add -A
if git diff --cached --quiet; then echo "Nothing to publish."; exit 0; fi
git commit -q -m "${1:-Update resume}" && git push -q origin HEAD && echo "Published."
