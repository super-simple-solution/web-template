import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import vueJsx from '@vitejs/plugin-vue-jsx'
import checker from 'vite-plugin-checker'

const pathUrl = 'https://xxx.com'

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  server: {
    strictPort: false,
    port: 3020,
    host: true,
    proxy: {
      '/api': {
        target: pathUrl,
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    checker({
      eslint: {
        // for example, lint .ts and .tsx
        lintCommand: 'eslint "./src/**/*.{ts,tsx,vue}"',
      },
    }),
    vue(),
    vueJsx(),
    svgLoader(),
    Components({
      dts: true,
      dirs: ['src/components'],
      resolvers: [ElementPlusResolver({ importStyle: 'sass' }), IconsResolver({ enabledCollections: ['ep'] })],
    }),
    Icons({ autoInstall: true }),
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
        /\.json$/, // .json
      ],
      // global imports to register
      imports: ['vue'],
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      resolvers: [
        ElementPlusResolver(),
        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({ prefix: 'Icon' }),
      ],
      dts: './auto-imports.d.ts',
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
})
