import { defineConfig, WxtViteConfig } from 'wxt';
import react from '@vitejs/plugin-react-swc';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';

import { WHATS_APP_WEB_URL_PATTERN } from './configs/consts';
import getClientEnvironment from './scripts/dotenv';
import pkg from './package.json' assert { type: 'json' };

const { raw } = getClientEnvironment('.');

const startUrls: string[] = [];

if (raw.WXT_DEV_START_PAGES) {
  const startURLs = raw.WXT_DEV_START_PAGES.split(',');
  startUrls.push(...startURLs);
}

// See https://wxt.dev/api/config.html
export default defineConfig({
  outDirTemplate: `{{browser}}_mv{{manifestVersion}}_{{command}}_{{mode}}_${pkg.version}`,
  modules: ['@wxt-dev/i18n/module'],
  manifest: () => {
    const web_accessible_resources = [
      {
        resources: ['wppconnect__wa.js', 'inject.js'],
        matches: [WHATS_APP_WEB_URL_PATTERN],
      },
    ];

    return {
      default_locale: 'zh_CN',
      name: '__MSG_EXT_name__',
      description: '__MSG_EXT_description__',
      short_name: 'WVant',
      minimum_chrome_version: '110',
      web_accessible_resources,
      permissions: ['tabs', 'storage', 'alarms'],
      host_permissions: ['https://ui-avatars.com/*', WHATS_APP_WEB_URL_PATTERN],
    };
  },
  webExt: {
    openConsole: true,
    keepProfileChanges: true,
    startUrls,
    chromiumArgs: [
      '--auto-open-devtools-for-tabs',
      `--user-data-dir=${raw.WXT_CHROME_USER_DATA_DIR || './.temp/chrome-data'}`,
    ],
  },
  alias: {
    '@api': './api',
    '@assets': './assets',
    '@background': './background',
    '@configs': './configs',
    '@common': './common',
    '@components': './components',
    '@content-scripts': './content-scripts',
    '@debug': './debug',
    '@hooks': './hooks',
    '@utils': './utils',
    '@styles': './styles',
    '@services': './services',
    types: './types',
  },
  imports: false,
  vite(env) {
    const cfg: WxtViteConfig = {
      plugins: [
        react({
          jsxImportSource: '@emotion/react',
          plugins: [
            [
              '@swc/plugin-emotion',
              {
                autoLabel: 'dev-only',
                sourceMap: true,
                labelFormat: '[local]__emtion',
              },
            ],
          ],
          useAtYourOwnRisk_mutateSwcOptions: (options) => {
            /**
             * jsc.target 与 env.targets 不能同时存在
             */
            options.jsc ??= {};
            options.jsc.target = undefined;

            options.env ??= {};
            options.env.coreJs = '3.41.0';
            options.env.targets = ['chrome >= 100', 'edge >= 100'];
            return options;
          },
        }),
      ],
      ssr: {
        noExternal: ['@webext-core/messaging', '@webext-core/i18n'],
      },
    };

    cfg.optimizeDeps ??= {
      include: ['@webext-core/messaging'],
      entries: [
        './entrypoints/*.ts',
        './entrypoints/background/index.ts',
        './entrypoints/inject.ts',
        './entrypoints/*/index.html',
      ],
    };
    cfg.optimizeDeps.force = true;

    if (env.mode === 'production' && env.command === 'build') {
      cfg.esbuild ??= {
        drop: ['console', 'debugger'],
      };
      cfg.build ??= {
        minify: 'esbuild',
      };
    }

    if (env.mode === 'production' && env.command === 'build' && raw.WXT_OBFUSCATOR) {
      cfg.plugins!.push(
        obfuscatorPlugin({
          options: {
            renamePropertiesMode: 'safe',
          },
        }),
      );
    }

    if (env.mode === 'development' && env.command === 'build') {
      cfg.build ??= {
        minify: false,
        sourcemap: true,
      };
    }

    return cfg;
  },
});
