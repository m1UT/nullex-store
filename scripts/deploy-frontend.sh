#!/usr/bin/env bash
# Run this on the frontend server (192.168.88.104)
set -e

cd /opt/nullex-store
git pull

# Rebuild frontend
/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm install --no-frozen-lockfile
/root/.nvm/versions/node/v24.13.0/bin/node /root/.nvm/versions/node/v24.13.0/bin/pnpm --filter 'web' build

# Write updated nginx config (adds /me proxy)
cat > /etc/nginx/sites-available/nullex-frontend << 'EOF'
server {
    listen 5173;
    root /opt/nullex-store/apps/web/dist;
    index index.html;

    location /products {
        proxy_pass http://192.168.88.103:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /me {
        proxy_pass http://192.168.88.103:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

nginx -t && nginx -s reload
echo "Frontend deployed and nginx reloaded"
