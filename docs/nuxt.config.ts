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

  components: [
    // live demos used in markdown as ::example-name, without a path prefix
    { path: '~/components/content/examples', pathPrefix: false, global: true },
    '~/components',
  ],

  // https://color-mode.nuxtjs.org/
  colorMode: { classSuffix: '' },

  app: {
    head: {
      title: 'Vue Select',
      meta: [
        {
          name: 'description',
          content:
            'Everything you wish the HTML select element could do, wrapped up into a lightweight, accessible and extensible Vue component.',
        },
      ],
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