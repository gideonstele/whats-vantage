import reactPlugin from 'eslint-plugin-react';
import * as reactHooks from 'eslint-plugin-react-hooks';
import pluginQuery from '@tanstack/eslint-plugin-query';

import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

import { flatConfigs } from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @type {import("eslint").Linter.Config}
 */
export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...eslint.configs.recommended,
    rules: {
      ...eslint.configs.recommended.rules,
      'no-console': ['off'],
      'no-unused-vars': ['off'],
      'no-undef': 'warn',
    },
  },
  // eslint-disable-next-line import-x/no-named-as-default-member
  ...tseslint.configs.recommended,
  flatConfigs.recommended,
  flatConfigs.typescript,
  {
    files: ['**/*.{ts,mts,cts,tsx}', '*/**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/ban-ts-comment': ['warn'],
    },
  },
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,ts,jsx,tsx}', '*/**/*.d.ts'],
    ignores: ['.wxt/**/*', '.output/**/*', '.temp/**/*', 'public/**/*'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['core-js', 'core-js/es'],
            [
              'lodash|dayjs|dexie|clsx|json-stable-stringify|ajax-hook',
              '^dexie-',
              'wxt',
              '^wxt\\/',
              '^@vitejs',
              '^vite-plugin',
            ],
            ['debug', '^@debug'],
            ['react|react-dom|react-router-dom|react-router', '^@tanstack', '^react-(?!transition-state)', '^use-'],
            [
              'antd|lucide-react|ahooks|axios|immer|@emotion',
              'react-transition-state',
              'radix-ui',
              '@radix-ui',
              '^@webext-core\\/',
              '^@ant-design',
            ],
            ['^@\\w'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^\\w'],
            ['^'],
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'warn',
      'import-x/no-duplicates': 'error',
      'import-x/no-named-as-default': 'off',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks:
            '(useIsomorphicLayoutEffect|useTrackedEffect|useDeepCompareEffect|useDeepCompareLayoutEffect|useAsyncEffect|useDebounceEffect|useUpdateEffect|useUpdateLayoutEffect)',
        },
      ],
    },
    settings: {
      react: { version: '19.1.0' },
      'import-x/core-modules': ['#imports'],
    },
  },
  {
    ...eslintPluginPrettierRecommended,
    rules: {
      ...eslintPluginPrettierRecommended.rules,
      'prettier/prettier': [
        'warn',
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  },
  {
    files: ['**/*.{cjs,cts}'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      'import/no-commonjs': 'off',
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    ignores: ['.wxt/**/*', '.output/**/*', '.swc/**/*', '.temp/**/*', 'public/**/*'],
  },
);
