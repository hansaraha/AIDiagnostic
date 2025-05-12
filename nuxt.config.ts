// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Configurar como SPA - esto es crucial para deshabilitar SSR
  ssr: false,

  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@vueuse/nuxt", "@nuxtjs/google-fonts"],

  // Custom CSS for UI kit
  css: ["~/assets/css/main.css"],

  colorMode: {
    preference: "dark",
    fallback: "dark",
  },

  googleFonts: {
    families: {
      Roboto: [400, 500, 700],
    },
    display: "swap",
    preload: true,
  },

  // Configuración para entorno SPA
  app: {
    head: {
      title: "Diagnóstico IA",
      meta: [
        {
          name: "description",
          content: "Diagnóstico profesional potenciado por IA",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
    // Configuración específica para SPA
    baseURL: "/",
    buildAssetsDir: "/_nuxt/",
  },

  // Para SPA, usamos vite en desarrollo, lo cual maneja el proxy de manera diferente
});
