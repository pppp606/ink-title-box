import type { Config } from 'jest';

const config: Config = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest/presets/default-esm',

  // Enable ESModule support
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // Test environment
  testEnvironment: 'node',

  // Module name mapping for ESM compatibility
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Transform configuration
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  // Transform node_modules that use ESM
  transformIgnorePatterns: [
    'node_modules/(?!(ink-testing-library|ink|react|string-width|strip-ansi|ansi-regex|get-east-asian-width|emoji-regex)/)',
  ],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/cli.tsx', // CLI executable file excluded from coverage
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage providers - for better performance
  coverageProvider: 'v8',

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
    'clover',
    'json-summary',
  ],

  // Coverage thresholds - realistic thresholds suitable for current implementation
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    // Individual file-level thresholds (values suitable for early development stage)
    './src/**/*.{ts,tsx}': {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },

  // Setup files
  setupFilesAfterEnv: [],

  // Module directories
  moduleDirectories: ['node_modules', 'src'],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};

export default config;
