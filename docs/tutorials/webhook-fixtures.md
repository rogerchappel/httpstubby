# Webhook Fixture Demo

HTTPStubby can stand in for a webhook receiver when an integration test needs a deterministic HTTP response but should not call a real service.

## Run the Demo

```sh
bash demo/webhook-contract-smoke.sh
```

The script starts HTTPStubby with the repository examples, posts to `/webhooks/order-delivered`, and verifies the response status, custom header, and JSON body.

## Fixture

The demo uses `examples/webhook-delivered.json`:

```json
{
  "route": {
    "method": "POST",
    "path": "/webhooks/order-delivered"
  },
  "response": {
    "status": 202,
    "headers": {
      "Content-Type": "application/json",
      "X-Stub-Event": "order.delivered"
    },
    "body": {
      "accepted": true,
      "event": "order.delivered",
      "queued": false
    }
  }
}
```

## CI Use

```sh
npm ci
npm run check
bash demo/webhook-contract-smoke.sh
```

Keep webhook fixtures free of real signing secrets, account IDs, and customer payloads. Use placeholders or synthetic IDs when a downstream client needs those fields.
