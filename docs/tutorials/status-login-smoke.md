# Status and Login Smoke Demo

This recipe records the two smallest HTTPStubby behaviors that are useful in a
demo or pull request note: a healthy `GET` route and a deterministic failing
`POST` route.

## Run it

```sh
bash demo/status-login-smoke.sh
```

The script starts HTTPStubby against `examples/`, captures response artifacts
under `${TMPDIR:-/tmp}/httpstubby-status-login-demo`, and verifies:

- `GET /api/status` returns the committed healthy fixture body.
- `POST /api/login` returns a `401` response.
- The login response body contains the `unauthorized` error fixture.

## Evidence files

- `status.json`: the successful status response body.
- `login.headers`: the failing login response headers.
- `login.json`: the failing login response body.
- `server.log`: server output from the local demo run.

Use this when a video or README snippet needs a very short success/failure
contract without introducing a larger checkout or webhook scenario.
