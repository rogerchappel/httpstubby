# HTTPStubby 🧸

A tiny local-first API stub server that turns JSON fixtures into deterministic HTTP responses.  
No cloud. No telemetry. No brittle ad-hoc scripts. Just fixtures on disk and a single command.

## Why HTTPStubby?

Developers and agents need safe, fake APIs without hidden network calls or SaaS dashboards.  
HTTPStubby reads `.json` fixture files, matches incoming requests, and returns exactly what you defined.  
It's perfect for integration tests, demos, agent sandboxes, and local prototyping.

## Quick Start

```bash
# Install
npm install -g httpstubby

# Create a demo project
httpstubby init ./my-stubs

# Start the server
httpstubby serve --dir ./my-stubs/fixtures

# Or use npx without installing
npx httpstubby serve --dir ./fixtures
```

## Fixture Format

Fixtures are simple JSON files under a directory:

```json
{
  "route": {
    "method": "GET",
    "path": "/hello"
  },
  "response": {
    "status": 200,
    "headers": { "Content-Type": "application/json" },
    "body": { "message": "Hello from HTTPStubby! 🧸" }
  }
}
```

Each `.json` file with a `route` and `response` key becomes an active stub.

## CLI Reference

```bash
httpstubby --help
httpstubby init [dir]                # Create a new fixture project
httpstubby serve [options]           # Start the stub server
  -p, --port <port>    Port to listen on (default: 8787)
  -d, --dir <dir>      Fixtures directory (default: ./fixtures)
  --cors               Enable CORS headers
```

## Examples

See the `fixtures/` and `examples/` directories for ready-to-run samples:

```bash
# Create demo fixtures
httpstubby init ./demo

# Run against them
httpstubby serve --dir ./demo/fixtures
curl http://127.0.0.1:8787/hello
```

## Safety & Design

- **Local-first**: Reads only the directories you pass explicitly.
- **No telemetry**: No hidden network calls, no analytics.
- **Deterministic**: Responses are exactly what your fixtures declare.
- **Fixture-backed tests**: Every feature is testable from disk.

## Development

```bash
git clone https://github.com/rogerchappel/httpstubby.git
cd httpstubby
npm install
npm test          # Run tests
npm run check     # Syntax-check source files
npm run smoke     # Run local smoke validation
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow and PR guidelines.

## License

MIT. See [LICENSE](LICENSE).

## Acknowledgements

Inspired by Mockoon, Prism, and WireMock — reframed as a zero-config fixture CLI for local agent workflows.
