import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',

  roots: ['<rootDir>/src/tests'],

  testMatch: ['**/*.test.ts'],

  moduleFileExtensions: ['ts', 'js'],

  clearMocks: true,

  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/tests/**'
  ],

  verbose: true
};

export default config;