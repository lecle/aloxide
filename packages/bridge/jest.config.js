module.exports = {
  preset: 'ts-jest',
  restoreMocks: true,
  collectCoverageFrom: ['src/**/*.{t,j}s?(x)'],
  rootDir: '.',
  roots: ['test']
};
