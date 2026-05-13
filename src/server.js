'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

function loadFixtures(fixturesDir) {
  if (!fs.existsSync(fixturesDir)) {
    return [];
  }
  const entries = fs.readdirSync(fixturesDir, { withFileTypes: true });
  const fixtures = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
    const filePath = path.join(fixturesDir, entry.name);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const fixture = JSON.parse(raw);
      if (fixture.route && fixture.response) {
        fixtures.push(fixture);
      }
    } catch {
      // skip invalid JSON
    }
  }
  return fixtures;
}

function matchRoute(fixtures, method, pathname) {
  for (const fixture of fixtures) {
    const routeMethod = (fixture.route.method || 'GET').toUpperCase();
    const routePath = fixture.route.path || '';
    if (routeMethod === method.toUpperCase() && routePath === pathname) {
      return fixture.response;
    }
  }
  return null;
}

function jsonBody(obj) {
  return Buffer.from(JSON.stringify(obj) + '\n', 'utf8');
}

function serve({ port, fixturesDir, cors }) {
  const resolved = path.resolve(fixturesDir);
  const fixtures = loadFixtures(resolved);

  if (fixtures.length === 0) {
    console.error(`No valid fixtures found in "${resolved}".`);
    process.exit(1);
  }

  const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url || '', true);
    const pathname = parsed.pathname || '/';
    const method = req.method || 'GET';

    const responseSpec = matchRoute(fixtures, method, pathname);

    if (cors) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (!responseSpec) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(404);
      res.end(jsonBody({ stub: 'not found', method, path: pathname }));
      return;
    }

    const status = responseSpec.status || 200;
    const headers = responseSpec.headers || {};
    const body = responseSpec.body !== undefined ? responseSpec.body : '';

    res.setHeader('Content-Type', headers['Content-Type'] || headers['content-type'] || 'application/json');
    for (const [k, v] of Object.entries(headers)) {
      if (k.toLowerCase() !== 'content-type') {
        res.setHeader(k, v);
      }
    }

    res.writeHead(status);
    if (typeof body === 'string') {
      res.end(body);
    } else {
      res.end(jsonBody(body));
    }
  });

  server.listen(port, () => {
    console.log(`HTTPStubby server listening at http://127.0.0.1:${port}`);
    console.log(`Serving ${fixtures.length} route(s) from "${resolved}"`);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('\nHTTPStubby stopped.');
      process.exit(0);
    });
  });
}

module.exports = { serve, loadFixtures, matchRoute };
