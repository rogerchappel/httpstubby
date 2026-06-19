#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

port="${PORT:-8797}"
base_url="http://127.0.0.1:${port}"
report_dir="${TMPDIR:-/tmp}/httpstubby-demo"
mkdir -p "$report_dir"

node src/index.js serve --dir examples --port "$port" > "$report_dir/server.log" 2>&1 &
server_pid=$!

cleanup() {
  kill "$server_pid" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in 1 2 3 4 5; do
  if curl -fsS "$base_url/api/status" > "$report_dir/status.json" 2>/dev/null; then
    break
  fi
  sleep 1
done

curl -fsS "$base_url/api/status" > "$report_dir/status.json"
curl -fsS -X POST "$base_url/api/users" > "$report_dir/create-user.json"

set +e
curl -fsS -X POST "$base_url/api/login" > "$report_dir/login.txt" 2>"$report_dir/login.err"
login_status=$?
set -e

if [ "$login_status" -eq 0 ]; then
  echo "expected login fixture to return an error status" >&2
  exit 1
fi

grep -Eq "healthy|ok|status" "$report_dir/status.json"
grep -Eq "id|created|user" "$report_dir/create-user.json"

echo "HTTPStubby demo responses written to $report_dir"
