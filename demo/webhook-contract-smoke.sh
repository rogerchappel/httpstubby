#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

port="${PORT:-8790}"
out_dir="${TMPDIR:-/tmp}/httpstubby-webhook-demo"
server_log="$out_dir/server.log"
headers="$out_dir/webhook.headers"
body="$out_dir/webhook.json"

rm -rf "$out_dir"
mkdir -p "$out_dir"

node src/index.js serve --dir ./examples --port "$port" >"$server_log" 2>&1 &
server_pid=$!

cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:$port/api/status" >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

curl -sS -D "$headers" -o "$body" -X POST "http://127.0.0.1:$port/webhooks/order-delivered"

grep -q "202" "$headers"
grep -qi "X-Stub-Event: order.delivered" "$headers"
grep -q '"accepted":true' "$body"

echo "Webhook response: $body"
echo "Webhook headers: $headers"
