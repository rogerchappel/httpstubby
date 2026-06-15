# HTTPStubby Local Contract Demo Hooks

Grounded source: `README.md`, `examples/`, and `demo/local-api-contract-demo.sh`.

## Short posts

1. HTTPStubby turns JSON fixtures into a local API target. The new demo starts the server, hits success and failure endpoints, and saves responses under `/tmp` for inspection.

2. Need a fake API for an integration demo without Docker or a SaaS mock server? `bash demo/local-api-contract-demo.sh` runs HTTPStubby against checked-in fixtures and captures the contract responses.

3. Non-2xx paths matter in demos too. The HTTPStubby local contract demo intentionally calls a rejected login fixture so reviewers can see success and failure behavior from disk.

## Video angle

Show the fixture directory, run the demo script, then open the captured `status.json`, `create-user.json`, and login error output. The point: a fixture-backed API can be inspected and rerun locally.
