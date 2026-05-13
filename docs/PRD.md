# HTTPStubby PRD

**Status:** implemented

## Pitch

A tiny local-first API stub server that turns JSON fixtures, HAR snippets, or OpenAPI-ish examples into deterministic HTTP responses for tests, demos, and agent sandboxes. 🧸

## Why It Matters

Developers and agents need safe fake APIs without cloud mocks, hidden telemetry, or brittle ad-hoc servers.

## Target Users

- CLI authors who want deterministic local checks.
- Agentic coding workflows that need safe, inspectable fixtures.
- Maintainers who prefer useful small tools over SaaS dashboards.

## V1 Scope (Implemented)

- TypeScript/Node.js CLI, local-first, no hidden network calls.
- Fixture-backed parser for JSON routes.
- `init` command to scaffold a fixture directory.
- `serve` command to start an HTTP stub server.
- Human-readable text output on the console.
- Useful examples under `fixtures/` and `examples/`.
- Tests under `test/` covering clean, warning, and edge cases.
- Safety defaults: read-only fixture serving, explicit paths, no destructive writes.

## Out of Scope

- Hosted service.
- Telemetry.
- Automatic destructive changes.
- LLM dependency.

## CLI

```bash
httpstubby --help
httpstubby init ./demo
httpstubby serve --dir ./demo/fixtures --port 8787
httpstubby serve --cors
```

## Functional Requirements

- Reads only the requested fixture paths.
- Produces deterministic ordered match results.
- Exits `1` for invalid input, responds `404` for unmatched routes.
- Includes enough context for another developer or agent to act safely.
- Ships fixture-backed tests via Node.js built-in `node:test`.

## Verification

- `npm test` — 5 unit tests pass.
- `npm run check` — syntax check passes.
- `npm run build` — no build step (vanilla JS).
- `bash scripts/validate.sh` — smoke test boots server and probes fixture.

## Source Attribution

Inspired by the broad ecosystem of API mocking and replay tools (Mockoon, Prism, WireMock), reframed as a zero-config fixture CLI for local agent workflows.
