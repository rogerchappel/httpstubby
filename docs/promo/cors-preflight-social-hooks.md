# HTTPStubby CORS Demo Social Hooks

## Short posts

1. Browser demos often need one small thing before the real request: a preflight
   response. HTTPStubby can serve local JSON fixtures with `--cors`, then prove
   it with a checked-in curl script.

2. A local API mock should be inspectable. In HTTPStubby, the fixture is a JSON
   file, the server command is one line, and the CORS/preflight evidence is just
   response headers in `/tmp`.

3. For frontend integration demos, HTTPStubby now has a fixture-backed CORS
   smoke script: start the server, send `OPTIONS`, curl the real route, and keep
   the headers as PR evidence.

## Grounded demo command

```sh
bash demo/cors-preflight-smoke.sh
```

Do not claim browser framework support beyond HTTP responses from local JSON
fixtures.
