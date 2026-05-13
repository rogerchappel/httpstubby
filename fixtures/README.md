# HTTPStubby Fixtures

Place `.json` fixture files in this directory. Each file defines one route → response mapping.

## Fixture Schema

```json
{
  "route": {
    "method": "GET",
    "path": "/api/health"
  },
  "response": {
    "status": 200,
    "headers": { "Content-Type": "application/json" },
    "body": { "ok": true }
  }
}
```

## Fields

| Key | Required | Description |
|-----|----------|-------------|
| `route.method` | Yes | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `route.path` | Yes | URL path to match (exact match) |
| `response.status` | No | HTTP status code (default: 200) |
| `response.headers` | No | Response headers object |
| `response.body` | No | Response body (string or object) |

## Serving

```bash
httpstubby serve --dir ./fixtures
```
