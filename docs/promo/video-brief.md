# Video Brief: Replace a Demo API With JSON Fixtures

## Grounded Product Facts

- HTTPStubby serves local HTTP responses from JSON fixture files.
- The CLI has `init` and `serve` commands.
- `serve` supports a fixture directory, port selection, and optional CORS headers.
- Missing routes return a JSON `404`.
- Invalid or missing fixture directories cause the server to exit non-zero.

## 90-Second Flow

1. Show `examples/checkout-catalog.json` and `examples/checkout-payment-declined.json`.
2. Start the server:

   ```bash
   node src/index.js serve --dir ./examples --port 8787
   ```

3. Call the happy and unhappy paths:

   ```bash
   curl http://127.0.0.1:8787/api/catalog
   curl -i -X POST http://127.0.0.1:8787/api/checkout
   ```

4. Call a missing route to show the deterministic fallback:

   ```bash
   curl -i http://127.0.0.1:8787/api/missing
   ```

## Talking Points

- "A fixture file is the contract: method, path, status, headers, and body."
- "This is useful for local demos, integration tests, and agent sandboxes."
- "It is intentionally small: no dashboard, no SaaS account, no telemetry."

## Avoid Claiming

- Do not claim request body matching.
- Do not claim latency simulation unless implemented.
- Do not claim OpenAPI compatibility.

