#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8791}"
OUT_DIR="${TMPDIR:-/tmp}/httpstubby-webhook-demo"
SERVER_LOG="$OUT_DIR/server.log"
SUCCESS_HEADERS="$OUT_DIR/payment-succeeded.headers"
SUCCESS_BODY="$OUT_DIR/payment-succeeded.json"
FAILED_HEADERS="$OUT_DIR/payment-failed.headers"
FAILED_BODY="$OUT_DIR/payment-failed.json"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

node "$ROOT_DIR/src/index.js" serve --dir "$ROOT_DIR/examples" --port "$PORT" >"$SERVER_LOG" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:$PORT/api/status" >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

curl -sS -D "$SUCCESS_HEADERS" -o "$SUCCESS_BODY" \
  -X POST "http://127.0.0.1:$PORT/webhooks/payment.succeeded"
grep -q "202" "$SUCCESS_HEADERS"
grep -q "X-Webhook-Fixture: payment-succeeded" "$SUCCESS_HEADERS"
grep -q '"next":"fulfill_order"' "$SUCCESS_BODY"

curl -sS -D "$FAILED_HEADERS" -o "$FAILED_BODY" \
  -X POST "http://127.0.0.1:$PORT/webhooks/payment.failed"
grep -q "409" "$FAILED_HEADERS"
grep -q "X-Webhook-Fixture: payment-failed" "$FAILED_HEADERS"
grep -q '"next":"notify_customer"' "$FAILED_BODY"

echo "Webhook demo artifacts written to $OUT_DIR"
