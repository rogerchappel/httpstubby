#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8798}"
BASE_URL="http://127.0.0.1:${PORT}"
OUT_DIR="${TMPDIR:-/tmp}/httpstubby-example-catalog"
SERVER_LOG="$OUT_DIR/server.log"
SUMMARY="$OUT_DIR/summary.txt"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"

node src/index.js serve --dir ./examples --port "$PORT" >"$SERVER_LOG" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "$BASE_URL/api/status" >"$OUT_DIR/status.json" 2>/dev/null; then
    break
  fi
  sleep 0.2
done

curl -fsS "$BASE_URL/api/status" >"$OUT_DIR/status.json"
curl -fsS "$BASE_URL/api/catalog" >"$OUT_DIR/catalog.json"
curl -fsS -X POST "$BASE_URL/api/users" >"$OUT_DIR/user-created.json"

curl -sS -D "$OUT_DIR/login.headers" -o "$OUT_DIR/login.json" -X POST "$BASE_URL/api/login"
grep -q "401" "$OUT_DIR/login.headers"

curl -sS -D "$OUT_DIR/webhook-failed.headers" -o "$OUT_DIR/webhook-failed.json" -X POST "$BASE_URL/webhooks/payment.failed"
grep -q "409" "$OUT_DIR/webhook-failed.headers"

{
  printf 'GET /api/status -> %s\n' "$OUT_DIR/status.json"
  printf 'GET /api/catalog -> %s\n' "$OUT_DIR/catalog.json"
  printf 'POST /api/users -> %s\n' "$OUT_DIR/user-created.json"
  printf 'POST /api/login -> %s\n' "$OUT_DIR/login.headers"
  printf 'POST /webhooks/payment.failed -> %s\n' "$OUT_DIR/webhook-failed.headers"
} >"$SUMMARY"

grep -q '"status":"healthy"' "$OUT_DIR/status.json"
grep -q '"sku":"starter"' "$OUT_DIR/catalog.json"
grep -q '"id":42' "$OUT_DIR/user-created.json"

printf 'HTTPStubby example catalog reports written to %s\n' "$OUT_DIR"
