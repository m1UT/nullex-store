#!/usr/bin/env bash
# Run this on the backend server (192.168.88.103)
set -e

cd /opt/nullex-store
git pull

cd apps/bot
PNPM=$(command -v pnpm || echo "/root/.nvm/versions/node/v24.13.0/bin/pnpm")
$PNPM install --no-frozen-lockfile
$PNPM build

systemctl restart backend.service
echo "Backend deployed and restarted"
