'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const CLI = path.join(__dirname, '..', 'src', 'index.js');

function runCLI(args) {
  const result = spawnSync('node', [CLI, ...args], {
    timeout: 5000,
    encoding: 'utf8',
  });
  return {
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

test('CLI --help outputs usage', () => {
  const { code, stdout } = runCLI(['--help']);
  assert.strictEqual(code, 0);
  assert.ok(stdout.includes('httpstubby'));
  assert.ok(stdout.includes('init'));
  assert.ok(stdout.includes('serve'));
});

test('CLI --version outputs version', () => {
  const { code, stdout } = runCLI(['--version']);
  assert.strictEqual(code, 0);
  assert.ok(stdout.includes('0.1.0'));
});

test('CLI init creates project directory', () => {
  const os = require('node:os');
  const fs = require('node:fs');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-cli-test-'));
  const projectDir = path.join(tmpDir, 'cli-project');

  const { code, stderr } = runCLI(['init', projectDir]);
  assert.strictEqual(code, 0, `init failed: ${stderr}`);

  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures')));
  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures', 'hello.json')));

  fs.rmSync(tmpDir, { recursive: true });
});

test('CLI init rejects existing directory', () => {
  const os = require('node:os');
  const fs = require('node:fs');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-cli-test-'));
  const projectDir = path.join(tmpDir, 'existing');
  fs.mkdirSync(projectDir);

  const { code, stderr } = runCLI(['init', projectDir]);
  assert.strictEqual(code, 1);
  assert.ok(stderr.includes('already exists'));

  fs.rmSync(tmpDir, { recursive: true });
});
