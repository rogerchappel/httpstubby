#!/usr/bin/env bash
set -euo pipefail

# HTTPStubby – local smoke validation script.
# Starts the stub server, probes a known fixture, and exits cleanly.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FIXTURES_DIR="$PROJECT_DIR/fixtures"
PORT=18787
PID=""

cleanup() {
  if [ -n "$PID" ]; then
    kill "$PID" 2>/dev/null || true
    wait "$PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

# Ensure fixtures directory exists and has fixture files
mkdir -p "$FIXTURES_DIR"

# Create a test fixture if none exist
TEST_FIXTURE="$FIXTURES_DIR/validate-test.json"
if [ ! -f "$TEST_FIXTURE" ]; then
  cat > "$TEST_FIXTURE" <<'FIXTURE'
{
  "route": {
    "method": "GET",
    "path": "/validate"
  },
  "response": {
    "status": 200,
    "headers": { "Content-Type": "application/json" },
    "body": { "smoke": "passed" }
  }
}
FIXTURE
fi

# Start the server in background
node "$PROJECT_DIR/src/index.js" serve --port "$PORT" --dir "$FIXTURES_DIR" &
PID=$!

# Wait for server to be ready
RETRIES=10
while [ $RETRIES -gt 0 ]; do
  if curl -s "http://127.0.0.1:${PORT}/validate" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
  RETRIES=$((RETRIES - 1))
done

if [ $RETRIES -eq 0 ]; then
  echo "FAIL: Server did not start within timeout" >&2
  exit 1
fi

# Probe the fixture
BODY=$(curl -s "http://127.0.0.1:${PORT}/validate")
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/validate")

if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | grep -q "smoke"; then
  echo "PASS: HTTPStubby smoke test succeeded (HTTP $HTTP_CODE, body contains 'smoke')"
  exit 0
else
  echo "FAIL: Unexpected response (HTTP $HTTP_CODE, body: ${BODY:0:100})" >&2
  exit 1
fi
