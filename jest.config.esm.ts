import type { Config } from 'jest';

const config: Config = {
  // ESM support
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // Test environment
  testEnvironment: 'node',

  // ESM module resolution
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^string-width$': '<rootDir>/__tests__/__mocks__/string-width.mjs',
  },

  // Transform configuration for ESM
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  // Don't transform ESM modules in node_modules
  transformIgnorePatterns: [
    // Allow transformation of ink and ink-testing-library
    'node_modules/(?!(ink|ink-testing-library|react|string-width|strip-ansi|ansi-regex|eastasianwidth|emoji-regex|ansi-styles|chalk|type-fest|cli-boxes)/)',
  ],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.esm.test.ts',
    '**/__tests__/**/*.esm.test.tsx',
  ],

  // Coverage configuration
  collectCoverage: false, // Disable for ESM tests to avoid conflicts

  // Module directories
  moduleDirectories: ['node_modules', 'src'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Setup files
  setupFilesAfterEnv: [],
};

export default config;
