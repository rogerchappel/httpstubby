'use strict';

const { test, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { serve } = require('../src/server.js');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const PORT = 19876;
let server = null;

function httpRequest(method, pathname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: pathname,
      method,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

test.before = async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-http-test-'));
  const fixturePath = path.join(tmpDir, 'test.json');
  fs.writeFileSync(
    fixturePath,
    JSON.stringify({
      route: { method: 'GET', path: '/http-test' },
      response: { status: 200, headers: { 'Content-Type': 'application/json' }, body: { result: 'ok' } },
    }),
    'utf8'
  );

  server = http.createServer((req, res) => {
    const { loadFixtures, matchRoute } = require('../src/server.js');
    const fixtures = loadFixtures(tmpDir);
    const urlMod = require('node:url');
    const parsed = urlMod.parse(req.url, true);
    const pathname = parsed.pathname || '/';
    const responseSpec = matchRoute(fixtures, req.method || 'GET', pathname);

    if (!responseSpec) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'not found' }));
      return;
    }

    res.writeHead(responseSpec.status || 200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(responseSpec.body));
  });

  await new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', resolve);
  });
};

test('HTTP server returns 200 for matched route', async () => {
  const { status, body } = await httpRequest('GET', '/http-test');
  assert.strictEqual(status, 200);
  const parsed = JSON.parse(body);
  assert.strictEqual(parsed.result, 'ok');
});

test('HTTP server returns 404 for unmatched route', async () => {
  const { status } = await httpRequest('GET', '/nonexistent');
  assert.strictEqual(status, 404);
});

test('HTTP server returns 404 for wrong method', async () => {
  const { status } = await httpRequest('POST', '/http-test');
  assert.strictEqual(status, 404);
});

after(() => {
  if (server) {
    server.close();
  }
});
