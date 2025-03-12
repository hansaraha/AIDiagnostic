// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Configurar como SPA - esto es crucial para deshabilitar SSR
  ssr: false,
  
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui'],
  
  colorMode: {
    preference: 'light',
    fallback: 'light',
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
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5678/webhook',
      useMockApi: process.env.USE_MOCK_API || 'true',
      appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000'
    }
  },
  
  // Para SPA, usamos vite en desarrollo, lo cual maneja el proxy de manera diferente
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.API_BASE_URL || 'http://localhost:5678/webhook',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})