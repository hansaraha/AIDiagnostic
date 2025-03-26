<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <UAlert
      v-if="isOffline"
      color="yellow"
      variant="solid"
      icon="i-heroicons-signal-slash"
      class="fixed top-0 left-0 w-full z-50 rounded-none shadow-md"
    >
      <p class="text-xs sm:text-sm md:text-base">
        No hay conexión a internet. Algunas funciones pueden no estar disponibles.
      </p>
    </UAlert>
  </transition>
</template>
  
  <script setup lang="ts">
  import useOfflineDetection from '~/composables/useOfflineDetection';
  
  const { isOffline } = useOfflineDetection();
  </script>