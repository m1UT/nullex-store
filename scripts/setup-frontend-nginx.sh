#!/bin/bash
set -e

PNPM=$(which pnpm 2>/dev/null || echo /root/.local/share/pnpm/pnpm)

echo "=== [1/4] Rebuilding frontend ==="
cd /opt/nullex-store
git pull
$PNPM install --no-frozen-lockfile
$PNPM --filter 'web' build

echo "=== [2/4] Installing nginx ==="
apt-get update -qq
apt-get install -y nginx

echo "=== [3/4] Configuring nginx ==="
cat > /etc/nginx/sites-available/nullex-frontend << 'NGINX'
server {
    listen 5173;

    root /opt/nullex-store/apps/web/dist;
    index index.html;

    location /products {
        proxy_pass http://192.168.88.103:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://192.168.88.103:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/nullex-frontend /etc/nginx/sites-enabled/nullex-frontend
rm -f /etc/nginx/sites-enabled/default
nginx -t

echo "=== [4/4] Switching from serve to nginx ==="
systemctl stop frontend.service
systemctl disable frontend.service
systemctl enable nginx
systemctl restart nginx

sleep 2
echo ""
echo "=== Result: GET /products ==="
wget -qO- http://localhost:5173/products 2>/dev/null || curl -s http://localhost:5173/products 2>/dev/null || echo "wget/curl not available"
echo ""
echo "Done!"
