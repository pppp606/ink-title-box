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
    'node_modules/(?!(ink-testing-library|ink|react)/)',
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
    '!src/cli.tsx', // CLI実行ファイルはカバレッジ対象外
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage providers - for better performance
  coverageProvider: 'v8',

  // Coverage reporters with options
  coverageReporters: [
    'text',
    'text-summary',
    [
      'html',
      {
        subdir: 'html',
        skipCovered: false,
        skipEmpty: false,
      },
    ],
    [
      'lcov',
      {
        outputFile: 'lcov.info',
      },
    ],
    [
      'json',
      {
        outputFile: 'coverage.json',
      },
    ],
    [
      'clover',
      {
        outputFile: 'clover.xml',
      },
    ],
    [
      'json-summary',
      {
        outputFile: 'coverage-summary.json',
      },
    ],
  ],

  // Coverage thresholds - 現在の実装に適した現実的なしきい値
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    // 個別ファイルレベルでのしきい値（開発初期段階に適した値）
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
