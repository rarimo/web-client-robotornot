import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { sentryRollupPlugin } from '@sentry/rollup-plugin'
import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import { checker } from 'vite-plugin-checker'
import { createHtmlPlugin } from 'vite-plugin-html'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tsconfigPaths from 'vite-tsconfig-paths'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = env.VITE_MODE === 'production'
  const isDevelopment = env.VITE_MODE === 'development'
  const isAnalyze = env.VITE_MODE === 'analyze'
  // const buildVersion = env.VITE_APP_BUILD_VERSION

  const APP_DOMAIN = env.VITE_APP_DOMAIN || `http://localhost:${env.VITE_PORT}`

  return {
    ...(env.VITE_PORT && {
      server: {
        port: Number(env.VITE_PORT),
      },
    }),
    define: {
      'process.env': {},
    },
    publicDir: 'static',
    plugins: [
      splitVendorChunkPlugin(),

      react(),

      createHtmlPlugin({
        inject: {
          tags: [
            {
              tag: 'title',
              children: 'Prove Your Humanity | Rarimo',
            },
            {
              tag: 'meta',
              attrs: {
                name: 'description',
                content:
                  'Prove your humanity using your identity provider of choice and get access to on-chain rewards with Rarimo.',
              },
            },

            {
              tag: 'meta',
              attrs: {
                property: 'og:url',
                content: APP_DOMAIN,
              },
            },
            {
              tag: 'meta',
              attrs: {
                property: 'og:type',
                content: 'website',
              },
            },
            {
              tag: 'meta',
              attrs: {
                property: 'og:title',
                content: 'Prove Your Humanity | Rarimo',
              },
            },
            {
              tag: 'meta',
              attrs: {
                property: 'og:description',
                content:
                  'Prove your humanity using your identity provider of choice and get access to on-chain rewards with Rarimo.',
              },
            },
            {
              tag: 'meta',
              attrs: {
                property: 'og:image',
                content: `${APP_DOMAIN}/branding/og-image.png`,
              },
            },
            {
              tag: 'meta',
              attrs: {
                property: 'og:locale',
                content: 'en_US',
              },
            },

            {
              tag: 'meta',
              attrs: {
                name: 'twitter:card',
                content: 'summary_large_image',
              },
            },
            {
              tag: 'meta',
              attrs: {
                name: 'twitter:domain',
                content: APP_DOMAIN,
              },
            },
            {
              tag: 'meta',
              attrs: {
                name: 'twitter:url',
                content: APP_DOMAIN,
              },
            },
            {
              tag: 'meta',
              attrs: {
                name: 'twitter:title',
                content: 'Prove Your Humanity | Rarimo',
              },
            },
            {
              tag: 'meta',
              attrs: {
                name: 'twitter:description',
                content:
                  'Prove your humanity using your identity provider of choice and get access to on-chain rewards with Rarimo.',
              },
            },
            {
              tag: 'meta',
              attrs: {
                name: 'twitter:image',
                content: `${APP_DOMAIN}/branding/og-image.png`,
              },
            },

            ...(isDevelopment
              ? [
                  {
                    tag: 'meta',
                    attrs: {
                      name: 'robots',
                      content: 'noindex',
                    },
                  },
                ]
              : []),
          ],
        },
      }),

      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(process.cwd(), 'src/assets/icons'),
          path.resolve(process.cwd(), 'static/images/providers'),
        ],
        symbolId: '[name]',
      }),
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        eslint: {
          lintCommand:
            'eslint "{src,config}/**/*.{jsx,tsx}" --cache --max-warnings=0',
        },
      }),
      ...(isAnalyze
        ? [
            visualizer({
              open: true,
            }),
          ]
        : []),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '@import "@/styles/_functions.scss";',
            '@import "@/styles/_mixins.scss";',
          ].join(''),
        },
      },
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      dedupe: ['react', 'lodash'],
      alias: {
        '@': `${root}/`,
        '@config': `${root}/config.ts`,
        '@static': `${root}/../static`,

        util: path.resolve(__dirname, 'node_modules/util/util.js'),
        ejc: path.resolve(__dirname, 'node_modules/ejs/ejs.min.js'),
        snarkjs: path.resolve(
          __dirname,
          'node_modules/snarkjs/build/snarkjs.min.js',
        ),

        /* prettier-ignore-start */
        /* eslint-disable */
        'near-api-js': 'near-api-js/dist/near-api-js.js',
        '@civic/ethereum-gateway-react': path.resolve(__dirname, 'node_modules/@civic/ethereum-gateway-react/dist/esm/index.js'),
        // '@rarimo/rarime-connector': path.resolve(__dirname, 'node_modules/@rarimo/rarime-connector/dist/index.js'),
        /* eslint-enable */
        /* prettier-ignore-end */
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
    build: {
      target: 'esnext',
      sourcemap: true,
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          nodePolyfills(),

          ...(env.VITE_SENTRY_AUTH_TOKEN && isProduction
            ? [
                sentryRollupPlugin({
                  authToken: env.VITE_SENTRY_AUTH_TOKEN,
                  org: 'dl-1be19f0cb',
                  project: 'javascript-react',
                }),
              ]
            : []),
        ],

        output: {
          sourcemap: true,

          manualChunks: {
            'ethereum-gateway-react': ['@civic/ethereum-gateway-react'],
            // 'rarime-connector': ['@rarimo/rarime-connector'],
            snarkjs: ['snarkjs'],
            uauth: ['@uauth/js'],
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  }
})
