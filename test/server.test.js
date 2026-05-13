'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { loadFixtures, matchRoute } = require('../src/server.js');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

test('loadFixtures returns empty array for nonexistent dir', () => {
  const fixtures = loadFixtures('/nonexistent/path/xyz');
  assert.strictEqual(fixtures.length, 0);
});

test('loadFixtures parses valid fixture files', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-test-'));
  const fixturePath = path.join(tmpDir, 'good.json');
  fs.writeFileSync(
    fixturePath,
    JSON.stringify({
      route: { method: 'GET', path: '/test' },
      response: { status: 200, body: { ok: true } },
    }),
    'utf8'
  );

  const fixtures = loadFixtures(tmpDir);
  assert.strictEqual(fixtures.length, 1);
  assert.strictEqual(fixtures[0].response.body.ok, true);

  fs.rmSync(tmpDir, { recursive: true });
});

test('matchRoute returns response for matching method and path', () => {
  const fixtures = [
    {
      route: { method: 'GET', path: '/hello' },
      response: { status: 200, body: 'hi' },
    },
    {
      route: { method: 'POST', path: '/users' },
      response: { status: 201, body: { created: true } },
    },
  ];

  const result = matchRoute(fixtures, 'GET', '/hello');
  assert.strictEqual(result.status, 200);
  assert.strictEqual(result.body, 'hi');

  const postResult = matchRoute(fixtures, 'POST', '/users');
  assert.strictEqual(postResult.status, 201);
  assert.deepStrictEqual(postResult.body, { created: true });
});

test('matchRoute returns null for unmatched route', () => {
  const fixtures = [
    {
      route: { method: 'GET', path: '/hello' },
      response: { status: 200, body: 'hi' },
    },
  ];

  const result = matchRoute(fixtures, 'DELETE', '/hello');
  assert.strictEqual(result, null);

  const result2 = matchRoute(fixtures, 'GET', '/goodbye');
  assert.strictEqual(result2, null);
});

test('loadFixtures skips invalid JSON files', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-test-'));
  const badPath = path.join(tmpDir, 'bad.json');
  fs.writeFileSync(badPath, 'not valid json {{{', 'utf8');
  const goodPath = path.join(tmpDir, 'good.json');
  fs.writeFileSync(
    goodPath,
    JSON.stringify({
      route: { method: 'GET', path: '/ok' },
      response: { status: 200, body: {} },
    }),
    'utf8'
  );

  const fixtures = loadFixtures(tmpDir);
  assert.strictEqual(fixtures.length, 1);
  assert.strictEqual(fixtures[0].route.path, '/ok');

  fs.rmSync(tmpDir, { recursive: true });
});
