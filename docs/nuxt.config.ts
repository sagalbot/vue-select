import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['~/assets/styles/main.css'],

  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
  ],

  // https://color-mode.nuxtjs.org/
  colorMode: { classSuffix: '' },

  app: {
    head: {
      title: 'Vue Select',
      meta: [{ name: 'description', content: 'My amazing site.' }],
    },
  },

  // https://content.nuxtjs.org/api/configuration
  content: {
    documentDriven: true,
    // https://content.nuxtjs.org/api/configuration/#highlighttheme
    highlight: {
      theme: {
        default: 'one-dark-pro',
        dark: 'github-dark',
        // sepia: "monokai",
      },
    },
  },

  svgo: {
    defaultImport: 'component',
  },

  googleFonts: {
    families: {
      'Public+Sans': [300, 400, 500, 600],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // resolve the aliases used in the vue-select build
        '@': resolve(__dirname, '../src'),
      },
    },
  },

  compatibilityDate: '2025-03-16',
})