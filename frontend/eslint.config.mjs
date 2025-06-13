// frontend/eslint.config.mjs
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig, baseConfigs, testRules, commonIgnores } from '../eslint.config.base.mjs';

export default [
  // Use recommended configs but not strictTypeChecked for frontend
  ...baseConfigs.filter(config => !config.name?.includes('strict')),
  {
    files: ['src/**/*.{ts,tsx}'],
    ...baseConfig,
    plugins: {
      ...baseConfig.plugins,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      ...baseConfig.settings,
      'import/resolver': {
        ...baseConfig.settings['import/resolver'],
        typescript: {
          ...baseConfig.settings['import/resolver'].typescript,
          project: './tsconfig.app.json',
        },
      },
    },
    rules: {
      ...baseConfig.rules,
      ...reactHooks.configs.recommended.rules,
      
      // Frontend-specific rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Frontend is more lenient about default exports (React components)
      'import/no-default-export': 'off',
      
      // Less strict TypeScript rules for frontend
      '@typescript-eslint/no-explicit-any': 'warn', // More lenient than backend
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // Can be annoying with React
    },
  },
  {
    // Config files that use different tsconfig
    files: ['vite.config.ts', 'vitest.config.ts'],
    plugins: {
      'import': baseConfig.plugins.import,
    },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      ...baseConfig.settings,
      'import/resolver': {
        ...baseConfig.settings['import/resolver'],
        typescript: {
          ...baseConfig.settings['import/resolver'].typescript,
          project: './tsconfig.node.json',
        },
      },
    },
    rules: {
      // Config files can be more lenient
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-default-export': 'off',
    },
  },
  {
    // Test files configuration
    files: ['tests/**/*.{ts,tsx}', 'src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    plugins: {
      'import': baseConfig.plugins.import,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.test.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      ...baseConfig.settings,
      'import/resolver': {
        ...baseConfig.settings['import/resolver'],
        typescript: {
          ...baseConfig.settings['import/resolver'].typescript,
          project: './tsconfig.test.json',
        },
      },
    },
    rules: {
      ...testRules,
    },
  },
  {
    ignores: [
      ...commonIgnores,
      'vite.config.js',
    ],
  }
];