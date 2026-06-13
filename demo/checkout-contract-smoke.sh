#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-8788}"
OUT_DIR="${TMPDIR:-/tmp}/httpstubby-checkout-demo"
SERVER_LOG="$OUT_DIR/server.log"
CATALOG_BODY="$OUT_DIR/catalog.json"
CHECKOUT_HEADERS="$OUT_DIR/checkout.headers"
MISSING_HEADERS="$OUT_DIR/missing.headers"

mkdir -p "$OUT_DIR"
cd "$ROOT_DIR"

node src/index.js serve --dir ./examples --port "$PORT" >"$SERVER_LOG" 2>&1 &
server_pid=$!
cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:$PORT/api/catalog" >"$CATALOG_BODY" 2>/dev/null; then
    break
  fi
  sleep 0.2
done

grep -q '"sku":"starter"' "$CATALOG_BODY"

curl -sS -D "$CHECKOUT_HEADERS" -o /dev/null -X POST "http://127.0.0.1:$PORT/api/checkout"
grep -q "402" "$CHECKOUT_HEADERS"

curl -sS -D "$MISSING_HEADERS" -o /dev/null "http://127.0.0.1:$PORT/api/missing"
grep -q "404" "$MISSING_HEADERS"

echo "Catalog response: $CATALOG_BODY"
echo "Checkout headers: $CHECKOUT_HEADERS"
echo "Missing-route headers: $MISSING_HEADERS"
