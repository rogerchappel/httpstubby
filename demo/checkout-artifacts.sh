#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
port="${PORT:-8789}"
out_dir="${TMPDIR:-/tmp}/httpstubby-checkout-artifacts"
server_log="$out_dir/server.log"

cd "$root_dir"
rm -rf "$out_dir"
mkdir -p "$out_dir"

node src/index.js serve --dir ./examples --port "$port" >"$server_log" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:$port/api/catalog" >"$out_dir/catalog.json" 2>/dev/null; then
    break
  fi
  sleep 0.2
done

curl -sS -D "$out_dir/checkout.headers" -o "$out_dir/checkout.json" \
  -X POST "http://127.0.0.1:$port/api/checkout"
curl -sS -D "$out_dir/missing.headers" -o "$out_dir/missing.json" \
  "http://127.0.0.1:$port/api/missing"

grep -q '"sku":"starter"' "$out_dir/catalog.json"
grep -q "402" "$out_dir/checkout.headers"
grep -q "404" "$out_dir/missing.headers"

echo "Catalog body: $out_dir/catalog.json"
echo "Checkout body: $out_dir/checkout.json"
echo "Checkout headers: $out_dir/checkout.headers"
echo "Missing-route headers: $out_dir/missing.headers"
