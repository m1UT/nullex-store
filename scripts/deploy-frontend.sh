#!/usr/bin/env bash
# Run this on the frontend server (192.168.88.104)
set -e

cd /opt/nullex-store
git pull

/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm --filter 'web' build

nginx -s reload
echo "Frontend deployed and nginx reloaded"
