# Checkout Fixture Demo

Use HTTPStubby to stand up a local checkout API with no Docker, cloud account, or network dependency beyond your own curl calls.

## Run

```bash
npm install
npm run check
node src/index.js serve --dir ./examples --port 8787
```

In another terminal:

```bash
curl http://127.0.0.1:8787/api/catalog
curl -i -X POST http://127.0.0.1:8787/api/checkout
curl -i http://127.0.0.1:8787/api/missing
```

Expected behavior:

- `/api/catalog` returns a `200` JSON body with two sample catalog items.
- `POST /api/checkout` returns `402` with a deterministic payment-declined body.
- Missing routes return HTTPStubby's built-in JSON `404`.

## Why This Demo Works

Each `.json` file in `examples/` maps one method and path to one response. HTTPStubby loads valid JSON fixtures at startup, serves matching routes read-only, and does not mutate the fixture files.

