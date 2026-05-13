#!/usr/bin/env node

'use strict';

const { Command } = require('commander');

const pkg = require('../package.json');
const { serve } = require('./server.js');
const { init } = require('./init.js');

const program = new Command();

program
  .name('httpstubby')
  .description('A tiny local-first API stub server from JSON fixtures.')
  .version(pkg.version);

program
  .command('init')
  .description('Create a new httpstubby fixture directory')
  .argument('[dir]', 'directory to create', './httpstubby-demo')
  .action((dir) => {
    init(dir);
  });

program
  .command('serve')
  .description('Start the stub server from fixtures')
  .option('-p, --port <port>', 'port to listen on', '8787')
  .option('-d, --dir <dir>', 'fixtures directory', './fixtures')
  .option('--cors', 'enable CORS headers', false)
  .action((opts) => {
    serve({
      port: Number(opts.port),
      fixturesDir: opts.dir,
      cors: opts.cors,
    });
  });

program.parse(process.argv);
