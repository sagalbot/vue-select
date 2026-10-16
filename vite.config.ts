import { resolve } from 'path'
import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: false,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
      '@docs': fileURLToPath(new URL('./docs', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      // UMD global, as in v3: VueSelect.default / VueSelect.VueSelect
      name: 'VueSelect',
      fileName: (format) => `vue-select.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue' },
        assetFileNames(chunk): string {
          if (chunk.name === 'style.css') {
            return 'vue-select.css'
          }
          return chunk.name || ''
        },
      },
    },
  },
  test: {
    coverage: {
      reporter: ['lcov'],
    },
  },
})
