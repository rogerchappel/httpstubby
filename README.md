# HTTPStubby 🧸

> A tiny local-first API stub server from JSON fixtures.  
> **No cloud. No telemetry. No bullshit.** Just fixtures on disk and a single command.

## Why?

You're building an integration test. Or a demo. Or an agent sandbox.  
You need a fake API that doesn't phone home, doesn't need Docker, and doesn't require a 47-step config file.

HTTPStubby reads `.json` fixtures from a directory and serves them as HTTP responses.  
That's it. That's the product.

## Quick Start

```bash
# Install globally
npm install -g httpstubby

# Scaffold a project
httpstubby init ./my-stubs

# Start the server
cd my-stubs && httpstubby serve

# Hit it
curl http://127.0.0.1:8787/hello
# → {"message":"Hello from HTTPStubby! 🧸"}
```

### One-shot with npx

```bash
npx httpstubby init ./demo && npx httpstubby serve --dir ./demo/fixtures
```

## Fixture Format

Every `.json` file in your fixtures directory is a route:

```json
{
  "route": {
    "method": "GET",
    "path": "/api/users/1"
  },
  "response": {
    "status": 200,
    "headers": { "Content-Type": "application/json" },
    "body": { "id": 1, "name": "Alice" }
  }
}
```

Save it as `fixtures/user-1.json`. Done.

## CLI Reference

```bash
httpstubby --help
httpstubby init [dir]                # Scaffold a fixture project
httpstubby serve [options]           # Start the stub server
```

### serve options

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --port` | `8787` | Port to listen on |
| `-d, --dir` | `./fixtures` | Fixtures directory |
| `--cors` | `false` | Enable CORS headers |

## Examples

The `examples/` directory ships with ready-to-run samples:

```bash
httpstubby serve --dir ./examples
curl http://127.0.0.1:8787/api/status     # → 200 healthy
curl -X POST http://127.0.0.1:8787/api/login   # → 401 unauthorized
curl -X POST http://127.0.0.1:8787/api/users   # → 201 created
```

For a slightly fuller checkout-flow demo, see [docs/tutorials/checkout-fixtures.md](docs/tutorials/checkout-fixtures.md).

## Safety & Guarantees

- **Local-first**: Reads only what you pass. No hidden API calls.
- **No telemetry**: Zero analytics. Zero tracking. None.
- **Deterministic**: Same fixture → same response, every time.
- **Read-only serving**: The server never writes to your fixtures.
- **Predictable exits**: `0` = running, `1` = no fixtures found.

## Development

```bash
git clone https://github.com/rogerchappel/httpstubby.git
cd httpstubby
npm install
npm test           # 14 tests
npm run check      # syntax validation
npm run smoke      # boots server, curls fixture
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). TL;DR: fork, branch, test, PR. Use Conventional Commits.

## License

MIT. See [LICENSE](LICENSE).

## Inspiration

Borrowed the good parts from Mockoon, Prism, and WireMock — stripped the dashboards, killed the SaaS, kept the fixtures.
