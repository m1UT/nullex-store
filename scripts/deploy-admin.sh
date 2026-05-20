#!/usr/bin/env bash
# Run this on the admin server
set -e

cd /opt/nullex-store
git pull

cd apps/admin
PNPM=$(command -v pnpm || echo "/root/.nvm/versions/node/v24.13.0/bin/pnpm")
$PNPM install --no-frozen-lockfile
$PNPM build

systemctl restart admin.service
echo "Admin deployed and restarted"
