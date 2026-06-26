# Video Brief: Fixture Matrix Smoke

## Hook

"One local fixture directory can show healthy responses, validation failures,
payment decline, webhook acceptance, and missing-route behavior."

## Demo beats

1. Open `examples/` and show that each route is a JSON fixture.
2. Run `bash demo/fixture-matrix-smoke.sh`.
3. Open the generated `summary.md`.
4. Show one success body, one failure header file, and the webhook response.
5. Mention that the server reads local fixtures and does not need cloud services.

## Grounded claims

- The script serves `./examples` with `node src/index.js serve`.
- It captures response bodies and headers under a temp directory.
- It verifies expected status codes and fixture body fields with `grep`.
