# Social Hooks

Short post drafts grounded in the current HTTPStubby behavior.

## Hook pack

1. A local demo API can be a folder of JSON files. HTTPStubby maps fixture files to method, path, status, headers, and body, then serves them from one CLI command.

2. For integration demos, the useful thing is often determinism: `GET /api/catalog` returns the same fixture every time, and a missing route returns the same JSON `404`.

3. HTTPStubby is deliberately small: no Docker requirement, no SaaS account, no telemetry, and no fixture mutation while serving.

4. The checkout demo has both paths a reviewer needs to see: a catalog success response and a deterministic `402` payment-declined response.

5. Agent sandboxes need APIs that do not surprise them. A JSON fixture server makes the reachable paths explicit before the agent starts calling endpoints.

## Demo CTA

```sh
npm install
bash demo/checkout-contract-smoke.sh
```

## Limits to say plainly

HTTPStubby serves static fixture responses. Do not claim request body matching, OpenAPI validation, persistence, or latency simulation unless those features are added later.
