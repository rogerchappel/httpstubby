# HTTPStubby Checkout Artifacts Video Brief

## Hook

"A demo API should be easy to run, easy to reset, and easy to show. HTTPStubby
serves JSON fixtures from disk and leaves deterministic curl evidence."

## Grounded demo beats

1. Open `examples/checkout-catalog.json` and `examples/checkout-payment-declined.json`.
2. Run `bash demo/checkout-artifacts.sh`.
3. Show the printed artifact paths for catalog body, checkout body, and headers.
4. Point out the fixture-backed `402` checkout response and the default `404`.
5. Close on the safety model: local fixtures, no telemetry, server reads only
   the directory passed to `serve`.

## Avoid claims

- Do not compare performance with larger mock servers.
- Do not claim protocol coverage beyond the current JSON fixture server.
- Do not invent user or download numbers.
