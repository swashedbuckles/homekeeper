import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: [
      ...configDefaults.exclude,
      'tests/visual'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        'src/vite-env.d.ts',
        'src/main.tsx', // Main entry point
        'vite.config.ts'
      ]
    },
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
    // Use test-specific TypeScript config
    typecheck: {
      tsconfig: './tsconfig.test.json'
    }
  },
  resolve: {
    alias: {
      // Match your vite config aliases if any
      '@': path.resolve(__dirname, './src'),
    },
  },
  // // Ensure TypeScript uses the test config
  // esbuild: {
  //   tsconfigRaw: './tsconfig.test.json'
  // }
});