// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      "tsConfig": "tsconfig.json",
      "isolatedModules": true,
    }
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  restoreMocks: true,
  testEnvironment: "node",
  testRegex: [
    "\/test\/((?!\.local).)+\.test\.ts$",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
