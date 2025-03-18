<template>
    <div 
      v-if="isOffline"
      class="fixed top-0 left-0 w-full z-50 bg-yellow-500 text-yellow-900 py-2 px-4 flex items-center justify-center shadow-md"
    >
      <UIcon name="i-heroicons-signal-slash" class="h-5 w-5 mr-2" />
      <span>No hay conexión a internet. Algunas funciones pueden no estar disponibles.</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import useOfflineDetection from '~/composables/useOfflineDetection';
  
  const { isOffline } = useOfflineDetection();
  </script>