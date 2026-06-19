#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
port="${PORT:-8791}"
out_dir="${TMPDIR:-/tmp}/httpstubby-cors-preflight"
server_log="$out_dir/server.log"

cd "$root_dir"
rm -rf "$out_dir"
mkdir -p "$out_dir"

node src/index.js serve --dir ./examples --port "$port" --cors >"$server_log" 2>&1 &
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

curl -sS -D "$out_dir/preflight.headers" -o /dev/null \
  -X OPTIONS "http://127.0.0.1:$port/api/catalog"
curl -sS -D "$out_dir/catalog.headers" -o "$out_dir/catalog.json" \
  "http://127.0.0.1:$port/api/catalog"

grep -q "204" "$out_dir/preflight.headers"
grep -qi "Access-Control-Allow-Origin: \\*" "$out_dir/preflight.headers"
grep -q '"sku":"starter"' "$out_dir/catalog.json"
grep -qi "Access-Control-Allow-Origin: \\*" "$out_dir/catalog.headers"

echo "Preflight headers: $out_dir/preflight.headers"
echo "Catalog headers: $out_dir/catalog.headers"
echo "Catalog body: $out_dir/catalog.json"
