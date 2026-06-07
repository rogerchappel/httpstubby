# HTTPStubby Examples

These JSON files demonstrate common fixture patterns:

| File | Purpose |
|------|---------|
| `basic.json` | Simple GET returning status |
| `error.json` | 401 error response |
| `created.json` | 201 created with resource body |
| `checkout-catalog.json` | GET catalog response for a checkout demo |
| `checkout-payment-declined.json` | POST checkout failure response |
| `delayed.json.template` | Template for latency simulation |

## Usage

```bash
httpstubby serve --dir ./examples
curl http://127.0.0.1:8787/api/status
curl -X POST http://127.0.0.1:8787/api/login
curl -X POST http://127.0.0.1:8787/api/users
curl http://127.0.0.1:8787/api/catalog
curl -X POST http://127.0.0.1:8787/api/checkout
```

See [Checkout Fixture Demo](../docs/tutorials/checkout-fixtures.md) for a complete tutorial.
