# Status/Login Demo Hooks

Grounded hooks for the `demo/status-login-smoke.sh` fixture flow.

## Short posts

1. Tiny API demos do not need a hosted sandbox. HTTPStubby can serve a healthy
   status route and a failing login route from JSON fixtures, then write the
   exact response evidence to `/tmp` for a PR note.
2. A useful stub server should make failures as deterministic as successes.
   This demo captures `GET /api/status` and `POST /api/login` from committed
   fixtures so reviewers can inspect both paths.
3. For integration demos, the fastest trust signal is often a local command that
   leaves artifacts behind: body JSON, response headers, and a server log.

## Video beat

- Open `examples/basic.json` and `examples/error.json`.
- Run `bash demo/status-login-smoke.sh`.
- Show `status.json` and `login.headers`.
- Close on the point that every response came from a checked-in fixture.
