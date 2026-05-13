# HTTPStubby Orchestration

## Repo

- **URL:** https://github.com/rogerchappel/httpstubby
- **Branch:** main

## Key Files

| File | Purpose |
|------|---------|
| `src/index.js` | CLI entry point (commander) |
| `src/server.js` | HTTP server, fixture loader, route matcher |
| `src/init.js` | Project scaffolding for new fixture dirs |
| `test/server.test.js` | Unit tests (node:test) |
| `scripts/validate.sh` | Local smoke test (boot server, curl fixture) |
| `package.json` | Metadata, bin, scripts, dependencies |
| `README.md` | Public-facing docs |
| `docs/PRD.md` | Product requirements |
| `docs/TASKS.md` | Task checklist |

## Dev Workflow

```bash
npm install
npm test           # unit tests
npm run check      # syntax validation
bash scripts/validate.sh  # smoke test
```

## Branch Protection

Attempted via `protect-github-main.sh`. See repo settings for actual status.
