# CORS Preflight Demo

This recipe shows HTTPStubby's optional CORS headers with the checked-in
checkout fixtures.

## Run

```sh
npm install
bash demo/cors-preflight-smoke.sh
```

The script starts HTTPStubby with `--cors`, sends an `OPTIONS` preflight request
to `/api/catalog`, then requests the catalog fixture.

## Expected evidence

- `preflight.headers` contains the `204` response and
  `Access-Control-Allow-Origin: *`.
- `catalog.headers` also contains `Access-Control-Allow-Origin: *`.
- `catalog.json` contains the fixture-backed `starter` SKU.

Use this demo when a frontend walkthrough needs a local stub API that can answer
browser preflight checks without adding a proxy or cloud mock server.
