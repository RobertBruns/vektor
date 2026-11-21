#!/usr/bin/env bash
# Pulls main and publishes dist/ into a docroot (no build step).
# Usage: scripts/deploy.sh <docroot>
#   e.g. scripts/deploy.sh /var/www/virtual/marcel/vektor.dpsg-marcelcallo.de
set -euo pipefail
docroot=${1:?docroot missing}
cd "$(dirname "$0")/.."
git fetch origin main
git checkout -f -B main origin/main
rsync -a --delete dist/ "$docroot"/
echo "deployed $(git rev-parse --short HEAD) to $docroot"
