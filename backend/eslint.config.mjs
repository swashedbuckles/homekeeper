import { baseConfig, baseConfigs, testRules, commonIgnores } from '../eslint.config.base.mjs';
import customPlugin from './eslint-plugins/index.mjs';

export default [
  ...baseConfigs,
  {
    files: ['src/**/*.ts'],
    ...baseConfig,
    plugins: {
      ...baseConfig.plugins,
      'custom': customPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      ...baseConfig.settings,
      'import/resolver': {
        ...baseConfig.settings['import/resolver'],
        typescript: {
          ...baseConfig.settings['import/resolver'].typescript,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...baseConfig.rules,
      'custom/enforce-api-response': 'warn',
      'import/no-default-export': 'warn',
      'import/no-unused-modules': 'warn',
      
      'import/order': [
        'error',
        {
          ...baseConfig.rules['import/order'][1],
          'newlines-between': 'ignore',
        }
      ],
    },
  },
  {
    files: ['tests/**/*.ts', '**/*.test.ts'],
    plugins: {
      'import': baseConfig.plugins.import,
    },
    languageOptions: {
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
      'import/no-default-export': 'off',
    },
  },
  {
    ignores: [
      ...commonIgnores,
      'vitest.config.js',
      'eslint-plugins/',
    ],
  }
];