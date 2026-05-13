'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { init } = require('../src/init.js');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

test('init creates directory structure', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-init-test-'));
  const projectDir = path.join(tmpDir, 'my-project');

  init(projectDir);

  assert.ok(fs.existsSync(projectDir));
  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures')));
  assert.ok(fs.existsSync(path.join(projectDir, 'httpstubby.config.json')));
  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures', 'hello.json')));
  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures', 'create-user.json')));
  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures', 'example.fixture.json')));

  // Check config content
  const config = JSON.parse(
    fs.readFileSync(path.join(projectDir, 'httpstubby.config.json'), 'utf8')
  );
  assert.strictEqual(config.port, 8787);
  assert.strictEqual(config.fixturesDir, './fixtures');

  fs.rmSync(tmpDir, { recursive: true });
});

test('init rejects existing directory', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-init-test-'));
  const projectDir = path.join(tmpDir, 'existing');
  fs.mkdirSync(projectDir);

  // Should exit with code 1, capture stderr
  const origExit = process.exit;
  const origStderr = process.stderr.write;
  let stderrOutput = '';

  process.exit = (code) => { throw new Error(`process.exit(${code})`); };
  process.stderr.write = (chunk) => { stderrOutput += chunk; return true; };

  assert.throws(() => init(projectDir), /exit\(1\)/);
  assert.ok(stderrOutput.includes('already exists'));

  process.exit = origExit;
  process.stderr.write = origStderr;

  fs.rmSync(tmpDir, { recursive: true });
});
