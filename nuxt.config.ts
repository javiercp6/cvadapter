import { defineNuxtConfig } from 'nuxt/config'
import en from './i18n/locales/en.json'

export default defineNuxtConfig({
  devtools: { enabled: true },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  // Runtime config for Stripe secret key (server-side only)
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  imports: {
    autoImport: true,
  },

  app: {
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'google-site-verification',
          content: 'CGbgWpLEg4fyBPWujKEYS3rrwZR4mMU7XfsDEGArchg',
        },
      ],
    },
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/styles/styles.css'],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/supabase',
  ],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: [
        '/',
        '/pricing',
        '/login',
        '/confirm',
        '/password/**',
        '/es',
        '/pt',
        '/es/pricing',
        '/pt/pricing',
        '/es/login',
        '/pt/login',
        '/es/confirm',
        '/pt/confirm',
        '/es/password/**',
        '/pt/password/**',
      ],
      saveRedirectToCookie: true,
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  postcss: {
    // Add plugin names as key and arguments as value
    // Install them before as dependencies with npm or yarn
    plugins: {
      'postcss-nested': {},
    },
  },

  fonts: {
    defaults: {
      weights: [300, 400, 700],
    },
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
    strategy: 'prefix_and_default',
    locales: [
      {
        code: 'en',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'es',
        file: 'es.json',
        name: 'Español',
      },
      {
        code: 'pt',
        file: 'pt.json',
        name: 'Portuguese',
      },
    ],
    lazy: false,
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  router: {
    options: {
      linkActiveClass: 'router-link-active',
    },
  },

  pwa: {
    devOptions: {
      enabled: false,
    },
    registerType: 'autoUpdate',
    pwaAssets: {
      config: true,
    },
    manifest: {
      name: 'AdapterCV',
      short_name: 'AdapterCV',
      lang: 'en',
      scope: '/',
      display: 'standalone',
      start_url: '/create',
      description: en.description,
      theme_color: '#f3f4f6',
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },

  sitemap: {
    autoI18n: true,
  },

  compatibilityDate: '2025-06-12',
})