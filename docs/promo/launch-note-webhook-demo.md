# Launch Note: Webhook Fixture Demo

HTTPStubby now includes a webhook-style fixture and smoke script for local integration demos.

## What Is New

- `examples/webhook-delivered.json` serves `POST /webhooks/order-delivered`.
- `demo/webhook-contract-smoke.sh` starts the local server, posts to the webhook route, and verifies the `202` response plus `X-Stub-Event` header.
- `docs/tutorials/webhook-fixtures.md` shows how to adapt the pattern for CI.

## Suggested Post

Webhook integrations are hard to demo safely when the real endpoint needs credentials. HTTPStubby can serve a local `POST /webhooks/order-delivered` response from a JSON fixture, including headers, status, and body.

Try it:

```sh
bash demo/webhook-contract-smoke.sh
```

No cloud, no telemetry, no real customer payloads.
