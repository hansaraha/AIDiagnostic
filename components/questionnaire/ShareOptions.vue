<template>
    <div class="mt-8 border-t pt-6">
      <h3 class="font-bold text-lg text-indigo-800 mb-4">¡Comparte tu diagnóstico!</h3>
      <p class="text-gray-600 mb-4">
        Ayuda a otros profesionales a mejorar sus habilidades compartiendo esta herramienta.
        <span class="font-medium">¡Además, por cada 3 personas que completen el cuestionario con tu enlace, recibirás un curso gratis!</span>
      </p>
      
      <div class="bg-indigo-50 p-4 rounded-lg mb-4">
        <p class="text-sm font-medium text-indigo-800 mb-2">Tu enlace único de referido:</p>
        <div class="flex items-center mb-2">
          <input 
            type="text" 
            :value="shareUrl" 
            readonly 
            class="flex-grow p-2 border rounded text-sm" 
          />
          <UButton 
            color="indigo" 
            variant="ghost" 
            icon="i-heroicons-clipboard" 
            class="ml-2" 
            @click="copyToClipboard"
          />
        </div>
        <p class="text-xs text-gray-500" v-if="copied">¡Enlace copiado al portapapeles!</p>
      </div>
      
      <p class="text-sm font-medium text-indigo-800 mb-3">Compartir en redes sociales:</p>
      <div class="flex space-x-3">
        <UButton 
          color="indigo" 
          class="flex-1"
          size="sm"
          @click="shareViaWhatsapp" 
        >
          WhatsApp
        </UButton>
        <UButton 
          color="indigo" 
          class="flex-1"
          size="sm"
          @click="shareViaTwitter" 
        >
          Twitter
        </UButton>
        <UButton 
          color="indigo" 
          class="flex-1"
          size="sm"
          @click="shareViaLinkedin" 
        >
          LinkedIn
        </UButton>
        <UButton 
          color="indigo" 
          class="flex-1"
          size="sm"
          @click="shareViaEmail" 
        >
          Email
        </UButton>
      </div>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">Personas que han usado tu enlace: <span class="font-bold">{{ referralCount }}</span></p>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div class="bg-indigo-600 h-2.5 rounded-full" :style="{ width: `${referralProgress}%` }"></div>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ referralMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import useApiService from '~/composables/useApiService';
  
  const props = defineProps({
    userId: {
      type: String,
      required: true
    },
    referralCode: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  });
  
  const apiService = useApiService();
  const referralCount = ref(0);
  const copied = ref(false);
  
  // En una SPA, accedemos a la configuración a través de useRuntimeConfig
const config = useRuntimeConfig();

// URL base de la aplicación desde la configuración o fallback al origin actual
const appBaseUrl = config.public.appBaseUrl || window.location.origin;

// URL completa para compartir
const shareUrl = computed(() => {
  return `${appBaseUrl}/?ref=${props.referralCode}`;
});
  
  // Progreso en la barra de referidos (0-100%)
  const referralProgress = computed(() => {
    const progress = (referralCount.value % 3) / 3 * 100;
    return progress;
  });
  
  // Mensaje de progreso
  const referralMessage = computed(() => {
    const remaining = 3 - (referralCount.value % 3);
    if (remaining === 0) {
      return '¡Has conseguido un curso gratis! Te enviaremos los detalles por email.';
    } else if (remaining === 1) {
      return '¡Solo necesitas 1 persona más para conseguir un curso gratis!';
    } else {
      return `Necesitas ${remaining} personas más para conseguir un curso gratis.`;
    }
  });
  
  // Obtener el conteo actual de referidos al montar el componente
  onMounted(async () => {
    try {
      const response = await fetch(`${appBaseUrl}/api/referral-count?userId=${props.userId}`);
      if (response.ok) {
        const data = await response.json();
        referralCount.value = data.count || 0;
      }
    } catch (error) {
      console.error('Error al obtener conteo de referidos:', error);
    }
  });
  
  // Función para copiar el enlace al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl.value).then(() => {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 3000);
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  };
  
  // Funciones para compartir en redes sociales
  const shareViaWhatsapp = async () => {
    await trackShare('whatsapp');
    const message = encodeURIComponent(`¡He descubierto mi perfil profesional con IA! Descubre el tuyo con este diagnóstico gratuito: ${shareUrl.value}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };
  
  const shareViaTwitter = async () => {
    await trackShare('twitter');
    const message = encodeURIComponent(`He completado mi Diagnóstico IA y descubierto cómo puedo mejorar mi productividad profesional. ¡Pruébalo gratis aquí! ${shareUrl.value}`);
    window.open(`https://twitter.com/intent/tweet?text=${message}`, '_blank');
  };
  
  const shareViaLinkedin = async () => {
    await trackShare('linkedin');
    const title = encodeURIComponent('Diagnóstico IA para Profesionales');
    const summary = encodeURIComponent(`He completado mi Diagnóstico IA y descubierto cómo puedo mejorar mi productividad profesional. ¡Pruébalo gratis!`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}&title=${title}&summary=${summary}`, '_blank');
  };
  
  const shareViaEmail = async () => {
    await trackShare('email');
    const subject = encodeURIComponent('Diagnóstico IA para Profesionales');
    const body = encodeURIComponent(`Hola,\n\nHe completado mi Diagnóstico IA y descubierto cómo puedo mejorar mi productividad profesional.\n\nCreo que te podría interesar probarlo: ${shareUrl.value}\n\nSaludos,\n${props.userName}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };
  
  // Registrar el evento de compartir
  const trackShare = async (method: string) => {
    try {
      await apiService.trackShare(props.userId, method);
    } catch (error) {
      console.error('Error al registrar compartir:', error);
    }
  };
  </script>