#!/usr/bin/env node

const program = require('commander');

const packageJSON = require('../package.json');
const { createAdapter } = require('./createAdapter');
const { generate } = require('./generate');

program.storeOptionsAsProperties(false).passCommandToAction(false).allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, '-v, --version');

program
  .command('create <aloxideConfigPath>')
  .option('-o, --output-path <outputPath>', 'path to output', '.')
  .option(
    '-a, --adapters <adapters>',
    'adapters name: eos, can, icon. Multiple values are separated by comma',
    createAdapter,
    createAdapter('eos', true),
  )
  .option('-n, --contract-name <contractName>', 'name of the generated contract', 'hello')
  .option(
    '--log-data-only',
    'With this option enabled, the generated smart-contract will not store any data to state-data. More info here: https://github.com/lecle/aloxide/issues/49',
    false,
  )
  .option('--verbose', 'display log', false)
  .option('--print-config <printConfig>', 'print out Aloxide configuration <pretty|json>')
  .action(generate);

program.parse(process.argv);
