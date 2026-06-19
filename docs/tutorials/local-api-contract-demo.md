# Local API Contract Demo

This walkthrough uses the checked-in `examples/` fixtures to run HTTPStubby as a local API contract target for demos, tests, or agent sandboxes.

## Scenario

You need stable responses for a status endpoint, a create-user flow, and a rejected login request without calling a real service or starting Docker.

## Run the demo

```sh
npm install
bash demo/local-api-contract-demo.sh
```

The script starts HTTPStubby on port `8797` by default, calls three fixture-backed endpoints, and writes captured responses under `${TMPDIR:-/tmp}/httpstubby-demo`.

To use a different port:

```sh
PORT=8899 bash demo/local-api-contract-demo.sh
```

## Inspect the responses

```sh
sed -n '1,80p' "${TMPDIR:-/tmp}/httpstubby-demo/status.json"
sed -n '1,80p' "${TMPDIR:-/tmp}/httpstubby-demo/create-user.json"
sed -n '1,80p' "${TMPDIR:-/tmp}/httpstubby-demo/login.err"
```

The failed login call is intentional: it proves the demo can exercise non-2xx contract behavior without depending on a remote API.

## Where to customize

- Add a new JSON fixture under `examples/` for another endpoint.
- Set `PORT` when the default demo port is already in use.
- Copy the captured response files into a test fixture folder when you need stable evidence for another tool.
