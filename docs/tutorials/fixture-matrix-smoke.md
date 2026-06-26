# Fixture Matrix Smoke

This walkthrough turns the checked-in `examples/` directory into a compact
contract matrix for local demos and pull-request evidence.

## Run it

```bash
bash demo/fixture-matrix-smoke.sh
```

The script starts HTTPStubby against `./examples`, calls success and failure
routes, and writes artifacts under `${TMPDIR:-/tmp}/httpstubby-fixture-matrix`.

## Routes covered

| Route | Fixture behavior |
|---|---|
| `GET /api/status` | healthy status body |
| `GET /api/catalog` | starter and team catalog body |
| `POST /api/users` | created user body |
| `POST /api/login` | `401` unauthorized response |
| `POST /api/checkout` | `402` payment declined response |
| `POST /webhooks/payment.succeeded` | `202` webhook accepted response |
| `GET /api/missing` | default missing-route response |

## Demo angle

Use `summary.md` as the overview and open the captured headers when explaining
how fixture-backed responses make success and failure paths repeatable without
external services.
