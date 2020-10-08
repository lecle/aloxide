/* eslint-disable import/no-extraneous-dependencies */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// Load the config which holds the path aliases.
const { compilerOptions } = require('../../tsconfig.json');

module.exports = {
  ...require('../../jest.config'),
  collectCoverageFrom: ['src/**/*.{t,j}s?(x)'],
};
