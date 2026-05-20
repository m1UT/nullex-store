#!/usr/bin/env bash
# Run this on the admin server
set -e

cd /opt/nullex-store
git pull

cd apps/admin
/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm install --no-frozen-lockfile
/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm build

systemctl restart admin.service
echo "Admin deployed and restarted"
