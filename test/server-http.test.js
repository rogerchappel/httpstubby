'use strict';

const { test, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const url = require('node:url');
const { loadFixtures, matchRoute } = require('../src/server.js');

const PORT = 19876;
let server = null;
let tmpDir = null;

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

// Setup: create temp dir with fixture and start server
tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-http-test-'));
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
  const fixtures = loadFixtures(tmpDir);
  const parsed = url.parse(req.url, true);
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

server.listen(PORT, '127.0.0.1');

after(() => {
  if (server) server.close();
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true });
});

test('HTTP server returns 200 for matched route', async () => {
  // Small delay to ensure server is bound
  await new Promise((r) => setTimeout(r, 100));
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
