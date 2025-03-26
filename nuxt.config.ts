

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Configurar como SPA - esto es crucial para deshabilitar SSR
  ssr: false,
  
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@nuxtjs/google-fonts'],
  
  // Custom CSS for UI kit
  css: ['~/assets/css/main.css'],
  
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  googleFonts: {
    families: {
      Roboto: [400, 500, 700]
    },
    display: 'swap',
    preload: true
  },
  
  // Configuración para entorno SPA
  app: {
    head: {
      title: 'Diagnóstico IA',
      meta: [
        { name: 'description', content: 'Diagnóstico profesional potenciado por IA' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // Configuración específica para SPA
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },
  
  runtimeConfig: {
    public: {
      // Estas variables estarán disponibles en el cliente
      apiBaseUrl: 'https://holaamigo.app.n8n.cloud/webhook-test/questionnaire-analysis',// process.env.API_BASE_URL || 'https://holaamigo.app.n8n.cloud/webhook/questionnaire-analysis',
      useMockApi: process.env.USE_MOCK_API || 'false', // Cambiado a 'false' por defecto
      appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000'
    }
  },
  
  // Para SPA, usamos vite en desarrollo, lo cual maneja el proxy de manera diferente
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.API_BASE_URL || 'https://holaamigo.app.n8n.cloud/webhook',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})