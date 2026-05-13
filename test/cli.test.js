'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const path = require('node:path');

function runCLI(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [path.join(__dirname, '..', 'src', 'index.js'), ...args], {
      timeout: 5000,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
    child.on('error', reject);
  });
}

test('CLI --help outputs usage', async () => {
  const { code, stdout } = await runCLI(['--help']);
  assert.strictEqual(code, 0);
  assert.ok(stdout.includes('httpstubby'));
  assert.ok(stdout.includes('init'));
  assert.ok(stdout.includes('serve'));
});

test('CLI init creates project directory', async () => {
  const os = require('node:os');
  const fs = require('node:fs');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-cli-test-'));
  const projectDir = path.join(tmpDir, 'cli-project');

  const { code, stderr } = await runCLI(['init', projectDir]);
  assert.strictEqual(code, 0);

  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures')));
  assert.ok(fs.existsSync(path.join(projectDir, 'fixtures', 'hello.json')));

  fs.rmSync(tmpDir, { recursive: true });
});

test('CLI init rejects existing directory', async () => {
  const os = require('node:os');
  const fs = require('node:fs');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'httpstubby-cli-test-'));
  const projectDir = path.join(tmpDir, 'existing');
  fs.mkdirSync(projectDir);

  const { code, stderr } = await runCLI(['init', projectDir]);
  assert.strictEqual(code, 1);
  assert.ok(stderr.includes('already exists'));

  fs.rmSync(tmpDir, { recursive: true });
});
