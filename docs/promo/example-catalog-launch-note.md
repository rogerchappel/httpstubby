# Example Catalog Launch Note

HTTPStubby now has a runnable example-catalog smoke demo that calls multiple
committed fixtures and captures local response artifacts.

## What changed

- `demo/example-catalog-smoke.sh` serves `examples/` and checks success,
  application-error, and webhook-error routes.
- `docs/tutorials/example-catalog-smoke.md` lists the response files and header
  files the script writes.
- `README.md` links the smoke demo from the examples section.

## Suggested post

The HTTPStubby examples folder now doubles as a small local API catalog. One
script serves the fixtures, calls health, catalog, create-user, login, and
webhook routes, then writes response bodies and headers for a PR note or demo.

Run it:

```sh
bash demo/example-catalog-smoke.sh
```

## Do not claim

- hosted mock API features
- Docker-based workflows
- dynamic latency support from the template fixture
