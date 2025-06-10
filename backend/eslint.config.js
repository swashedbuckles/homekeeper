import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import customPlugin from './eslint-plugins/index.js';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    // Configuration for source files
    files: ['src/**/*.ts'],
    plugins: {
      'custom': customPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'custom/enforce-api-response': 'warn',
    },
  },
  {
    // Configuration for test files
    files: ['tests/**/*.ts', '**/*.test.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.test.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // More relaxed rules for tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      "@typescript-eslint/restrict-template-expressions": "off",
      '@typescript-eslint/no-unused-vars': 'off', // Vitest globals might appear unused
    },
  },
  {
    ignores: [
      'dist/', 
      'node_modules/', 
      'coverage/',
      'eslint.config.js', 
      'vitest.config.js',
      'eslint-plugins/',
      '**/*.js',            // Ignore all .js files (we're TypeScript-first)
    ],
  }
);