'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { validateFixture } = require('../src/validator.js');

test('validates a valid fixture', () => {
  const errors = validateFixture({
    route: { method: 'GET', path: '/ok' },
    response: { status: 200, body: {} },
  });
  assert.deepStrictEqual(errors, []);
});

test('catches missing route object', () => {
  const errors = validateFixture({ response: { status: 200 } });
  assert.ok(errors.some((e) => e.includes('route')));
});

test('catches missing route.method', () => {
  const errors = validateFixture({
    route: { path: '/ok' },
    response: { status: 200 },
  });
  assert.ok(errors.some((e) => e.includes('method')));
});

test('catches missing route.path', () => {
  const errors = validateFixture({
    route: { method: 'GET' },
    response: { status: 200 },
  });
  assert.ok(errors.some((e) => e.includes('path')));
});

test('catches invalid HTTP method', () => {
  const errors = validateFixture({
    route: { method: 'INVALID', path: '/ok' },
    response: { status: 200 },
  });
  assert.ok(errors.some((e) => e.includes('invalid')));
});

test('catches invalid status code', () => {
  const errors = validateFixture({
    route: { method: 'GET', path: '/ok' },
    response: { status: 999 },
  });
  assert.ok(errors.some((e) => e.includes('status')));
});

test('catches missing response object', () => {
  const errors = validateFixture({
    route: { method: 'GET', path: '/ok' },
  });
  assert.ok(errors.some((e) => e.includes('response')));
});
