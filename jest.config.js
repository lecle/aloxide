const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const { pathsToModuleNameMapper } = require('ts-jest/utils');

// Load the config which holds the path aliases.
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  collectCoverageFrom: ['src/**/*.{t,j}s?(x)'],
  resolver: path.resolve(__dirname, './jest-resolver'),
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    // This has to match the baseUrl defined in tsconfig.json.
    prefix: '<rootDir>/../../',
  }),
};
