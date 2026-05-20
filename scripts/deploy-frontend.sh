#!/usr/bin/env bash
# Run this on the frontend server (192.168.88.104)
set -e

cd /opt/nullex-store
git pull

PNPM=$(command -v pnpm || echo "/root/.nvm/versions/node/v24.13.0/bin/pnpm")
$PNPM --filter 'web' build

systemctl restart frontend.service
echo "Frontend deployed and restarted"
