import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // Public keys (available on both client and server)
    public: {
      nestREST: process.env.PUBLIC_NEST_URL || 'http://localhost/',
      nestGRAPH: process.env.PUBLIC_NEST_GRAPH || 'http://localhost/',
      golangREST: process.env.GOLANG_URL || 'http://localhost/',
      apiBase: process.env.PUBLIC,
      tempToken : process.env.TEMP_TOKEN
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: [
    '~/assets/css/tailwind.css',
  ],
  modules: [
    '@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils', 'nuxt-icon', '@pinia/nuxt',
  ]
})