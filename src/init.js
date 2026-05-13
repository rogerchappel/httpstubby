'use strict';

const fs = require('node:fs');
const path = require('node:path');

function writeJSON(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function init(dir) {
  if (fs.existsSync(dir)) {
    console.error(`Directory "${dir}" already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  const fixturesDir = path.join(dir, 'fixtures');
  fs.mkdirSync(fixturesDir, { recursive: true });

  writeJSON(path.join(dir, 'httpstubby.config.json'), {
    port: 8787,
    fixturesDir: './fixtures',
    cors: true,
  });

  writeJSON(path.join(fixturesDir, 'hello.json'), {
    route: {
      method: 'GET',
      path: '/hello',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Hello from HTTPStubby! 🧸' },
    },
  });

  writeJSON(path.join(fixturesDir, 'create-user.json'), {
    route: {
      method: 'POST',
      path: '/users',
    },
    response: {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
      body: { id: 1, name: 'Alice', created: true },
    },
  });

  const examplePath = path.join(fixturesDir, 'example.fixture.json');
  fs.writeFileSync(
    examplePath,
    `\
{
  "_comment": "HTTPStubby fixture: define a route and response",
  "route": {
    "method": "GET",
    "path": "/ping"
  },
  "response": {
    "status": 200,
    "headers": { "Content-Type": "application/json" },
    "body": { "pong": true }
  }
}
`.trim() + '\n',
    'utf8'
  );

  console.log(`Created HTTPStubby project in "${dir}".`);
  console.log(`  cd ${dir}`);
  console.log(`  npx httpstubby serve`);
}

module.exports = { init };
