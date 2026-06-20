# Example Catalog Smoke

This demo treats the committed `examples/` directory as a small API catalog. It
starts HTTPStubby, calls success and failure routes, and writes response bodies
or headers that can be pasted into a PR note.

## Run it

```sh
bash demo/example-catalog-smoke.sh
```

The script serves `examples/` on a local port and writes artifacts under:

```text
/tmp/httpstubby-example-catalog
```

## What to look for

- `status.json` proves the basic health fixture returns `200`.
- `catalog.json` proves the checkout catalog fixture includes the `starter`
  SKU.
- `user-created.json` proves the create-user fixture returns an ID.
- `login.headers` proves the login fixture returns `401`.
- `webhook-failed.headers` proves the failed payment webhook returns `409`.

The demo is intentionally local: it uses the committed JSON fixtures and curl
against `127.0.0.1`.

## Promotion angle

This is a compact way to show HTTPStubby as a demo and integration-test helper:
one fixture folder can model happy paths, application errors, and webhook retry
cases without Docker or a hosted mock API.
