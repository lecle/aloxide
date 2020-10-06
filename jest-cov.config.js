module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  collectCoverageFrom: ['packages/*/src/**/*.{j,t}s?(x)'],
  coveragePathIgnorePatterns: ['/packages/.*example.*/'],
  testPathIgnorePatterns: ['/packages/.*example.*/'],
};
