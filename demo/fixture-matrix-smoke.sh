#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
port="${PORT:-8799}"
base_url="http://127.0.0.1:${port}"
out_dir="${TMPDIR:-/tmp}/httpstubby-fixture-matrix"
server_log="$out_dir/server.log"
summary="$out_dir/summary.md"

rm -rf "$out_dir"
mkdir -p "$out_dir"
cd "$root_dir"

node src/index.js serve --dir ./examples --port "$port" >"$server_log" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "$base_url/api/status" >"$out_dir/status.json" 2>/dev/null; then
    break
  fi
  sleep 0.2
done

curl -fsS "$base_url/api/catalog" >"$out_dir/catalog.json"
curl -fsS -X POST "$base_url/api/users" >"$out_dir/user-created.json"

curl -sS -D "$out_dir/login.headers" -o "$out_dir/login.json" -X POST "$base_url/api/login"
curl -sS -D "$out_dir/checkout.headers" -o "$out_dir/checkout.json" -X POST "$base_url/api/checkout"
curl -sS -D "$out_dir/webhook.headers" -o "$out_dir/webhook.json" -X POST "$base_url/webhooks/payment.succeeded"
curl -sS -D "$out_dir/missing.headers" -o "$out_dir/missing.json" "$base_url/api/missing"

grep -q '"status":"healthy"' "$out_dir/status.json"
grep -q '"sku":"starter"' "$out_dir/catalog.json"
grep -q '"id":42' "$out_dir/user-created.json"
grep -q "401" "$out_dir/login.headers"
grep -q '"error":"unauthorized"' "$out_dir/login.json"
grep -q "402" "$out_dir/checkout.headers"
grep -q '"error":"payment_declined"' "$out_dir/checkout.json"
grep -q "202" "$out_dir/webhook.headers"
grep -q '"next":"fulfill_order"' "$out_dir/webhook.json"
grep -q "404" "$out_dir/missing.headers"

{
  printf '# HTTPStubby Fixture Matrix\n\n'
  printf '| Request | Expected evidence |\n'
  printf '|---|---|\n'
  printf '| GET /api/status | status.json contains healthy |\n'
  printf '| GET /api/catalog | catalog.json contains starter SKU |\n'
  printf '| POST /api/users | user-created.json contains id 42 |\n'
  printf '| POST /api/login | login.headers contains 401 |\n'
  printf '| POST /api/checkout | checkout.headers contains 402 |\n'
  printf '| POST /webhooks/payment.succeeded | webhook.headers contains 202 |\n'
  printf '| GET /api/missing | missing.headers contains 404 |\n'
} >"$summary"

echo "HTTPStubby fixture matrix artifacts written to $out_dir"
echo "Summary: $summary"
