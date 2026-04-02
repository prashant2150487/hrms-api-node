export default {
  // Use ESM support natively
  transform: {},
  // Optional: if you use TS eventually, you can configure ts-jest
  // preset: 'ts-jest/presets/default-esm',

  testEnvironment: 'node',
  
  // The global setup/teardown will be useful for DB
  // globalSetup: './tests/utils/globalSetup.js',
  // globalTeardown: './tests/utils/globalTeardown.js',

  // Clear mocks before every test
  clearMocks: true,

  // Collect coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
  ],
  coverageDirectory: 'coverage',
  
  // Match both inside tests folder or alongside source files
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
};
