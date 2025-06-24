import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export const baseConfig = {
  plugins: {
    'import': importPlugin,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'jsx-quotes': ['error', 'prefer-double'],
    'semi': 'error',
    'no-unused-vars': 'off',
    
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/restrict-template-expressions': 'off',
    
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type'
      ],
      'pathGroups': [
        {
          'pattern': '@shared/**',
          'group': 'internal',
          'position': 'before'
        }
      ],
      'pathGroupsExcludedImportTypes': ['builtin', 'external', 'object'],
      'newlines-between': 'ignore',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'import/newline-after-import': 'error',
  },
};

export const baseConfigs = [
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
];

// Test configuration overrides
export const testRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/unbound-method': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-confusing-void-expression': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
  'import/no-unused-modules': 'off',
  'no-unused-vars': 'off',

};

export const commonIgnores = [
  'dist/',
  'node_modules/',
  'coverage/',
  'eslint.config.js',
  'eslint.config.mjs',
  '**/*.js', 
];
