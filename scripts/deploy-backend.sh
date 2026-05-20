#!/usr/bin/env bash
# Run this on the backend server (192.168.88.103)
set -e

cd /opt/nullex-store
git pull

cd apps/bot
/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm install --no-frozen-lockfile
/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm build

systemctl restart backend.service
echo "Backend deployed and restarted"
