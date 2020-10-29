module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  collectCoverageFrom: ['packages/*/src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/packages/.*example.*/'],
  testPathIgnorePatterns: ['/packages/.*example.*/'],
};
