# Checkout Demo Artifacts

This demo captures the HTTP response artifacts from the existing checkout
fixtures so they can be attached to a PR, release note, or short walkthrough.

## Run it

```sh
npm install
bash demo/checkout-artifacts.sh
```

The script starts HTTPStubby against `examples/`, curls the catalog, checkout,
and missing-route endpoints, then writes response bodies and headers under a
temporary directory.

## Expected evidence

- `catalog.json` includes the `starter` SKU.
- `checkout.headers` includes the fixture-backed `402` response.
- `missing.headers` includes the default `404` response.

Use this alongside `demo/checkout-contract-smoke.sh` when a walkthrough needs
both command verification and shareable response artifacts.
