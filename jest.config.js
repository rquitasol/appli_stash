const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './apps/web',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/apps/web/.next/'],
  collectCoverageFrom: [
    'apps/web/src/**/*.{js,jsx,ts,tsx}',
    'apps/web/app/**/*.{js,jsx,ts,tsx}',
    'packages/shared/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
