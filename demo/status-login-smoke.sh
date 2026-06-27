#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8791}"
OUT_DIR="${TMPDIR:-/tmp}/httpstubby-status-login-demo"
SERVER_LOG="$OUT_DIR/server.log"
STATUS_BODY="$OUT_DIR/status.json"
LOGIN_HEADERS="$OUT_DIR/login.headers"
LOGIN_BODY="$OUT_DIR/login.json"

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
  if curl -fsS "http://127.0.0.1:$PORT/api/status" >"$STATUS_BODY" 2>/dev/null; then
    break
  fi
  sleep 0.2
done

grep -q '"status":"healthy"' "$STATUS_BODY"

curl -sS -D "$LOGIN_HEADERS" -o "$LOGIN_BODY" \
  -X POST "http://127.0.0.1:$PORT/api/login"

grep -q "401" "$LOGIN_HEADERS"
grep -q '"error":"unauthorized"' "$LOGIN_BODY"

echo "Status body: $STATUS_BODY"
echo "Login headers: $LOGIN_HEADERS"
echo "Login body: $LOGIN_BODY"
