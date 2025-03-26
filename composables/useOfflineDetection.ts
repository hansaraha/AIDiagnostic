import { ref, onMounted, onUnmounted } from 'vue';

export default function useOfflineDetection() {
  // Estado para rastrear si el usuario está actualmente offline
  const isOffline = ref(false);
  
  // Comprobar el estado inicial
  if (typeof window !== 'undefined') {
    isOffline.value = !navigator.onLine;
  }
  
  // Manejadores de eventos
  const handleOffline = () => {
    isOffline.value = true;
    document.body.classList.add('is-offline');
  };
  
  const handleOnline = () => {
    isOffline.value = false;
    document.body.classList.remove('is-offline');
  };
  
  // Configurar event listeners
  onMounted(() => {
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
  });
  
  // Limpiar event listeners
  onUnmounted(() => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  });
  
  return {
    isOffline
  };
}