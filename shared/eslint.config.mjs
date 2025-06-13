// shared/eslint.config.js
import { baseConfig, baseConfigs, testRules, commonIgnores } from '../eslint.config.base.mjs';

export default [
  ...baseConfigs,
  {
    files: ['src/**/*.ts'],
    ...baseConfig,
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
      'import/no-default-export': 'off', 
      '@typescript-eslint/explicit-function-return-type': 'warn', 
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'import/no-unused-modules': 'off', 
    },
  },
  {
    // Test files 
    files: ['**/*.test.ts', '**/*.spec.ts'],
    plugins: {
      'import': baseConfig.plugins.import,
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
      ...testRules,
    },
  },
  {
    ignores: commonIgnores,
  }
];