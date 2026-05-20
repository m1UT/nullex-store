#!/bin/bash
set -e

AUTH="Authorization: Bearer ${ADMIN_SECRET:-7514895263}"
CT="Content-Type: application/json"
URL="http://localhost:${PORT:-5000}/api/admin/products"

post() {
  local name="$1"
  local body="$2"
  local result
  result=$(curl -s -w "\n%{http_code}" -X POST "$URL" -H "$AUTH" -H "$CT" -d "$body")
  local code
  code=$(echo "$result" | tail -1)
  local resp
  resp=$(echo "$result" | head -1)
  echo "[$code] $name: $resp"
}

post "Neon Arena" \
  '{"name":"Neon Arena","description":"Динамичный шутер в неоновом киберпанк-мире. Мультиплеер до 20 игроков.","category":"GAMES","price":24.99,"stock":12}'

post "Shadow Tactics" \
  '{"name":"Shadow Tactics","description":"Пошаговая тактическая RPG с процедурно-генерируемыми подземельями.","category":"GAMES","price":19.99,"stock":0}'

post "DevKit Pro" \
  '{"name":"DevKit Pro","description":"Набор инструментов для разработчиков: редактор, дебаггер и CI/CD. Лицензия на 1 год.","category":"SOFTWARE","price":49.99,"stock":5}'

post "VaultGuard" \
  '{"name":"VaultGuard","description":"Менеджер паролей, VPN и антивирус в одном. Поддержка до 5 устройств.","category":"SOFTWARE","price":14.99,"stock":99}'

post "StreamPass" \
  '{"name":"StreamPass","description":"Безлимитный доступ к фильмам и сериалам в 4K. Без рекламы, офлайн-загрузка.","category":"SUBSCRIPTIONS","price":9.99,"stock":0}'

post "CloudMax" \
  '{"name":"CloudMax","description":"2TB облачного хранилища с автосинхронизацией. Шифрование AES-256.","category":"SUBSCRIPTIONS","price":4.99,"stock":34}'

echo ""
echo "Done. Checking /products:"
curl -s http://localhost:${PORT:-5000}/products | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'Total: {len(data)} products')"
