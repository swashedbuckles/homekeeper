import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      tsconfig: './tsconfig.test.json'
    },
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    testTimeout: 10000,
    testMatch: [
      'src/**/*.test.ts',
      'tests/**/*.test.ts',
      'tests/**/*.integration.ts',
      'tests/**/*.e2e.ts',
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/**',
        'vitest.config.js',
        'tests/**',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },
  },
});
