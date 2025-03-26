<template>
  <UAlert
    v-if="error"
    :variant="alertVariant"
    :color="alertColor"
    :icon="errorIcon"
    class="w-full mb-4"
  >
    <template #title>
      <span class="font-medium">{{ errorTitle }}</span>
    </template>
    <p class="text-sm sm:text-base">{{ error.message }}</p>
    <div 
      v-if="showDetails && error.details" 
      class="mt-2 text-xs whitespace-pre-wrap p-2 rounded bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-20"
    >
      {{ JSON.stringify(error.details, null, 2) }}
    </div>
    
    <template #footer>
      <div class="flex flex-wrap gap-2 mt-2">
        <UButton
          v-if="error.retry"
          size="sm"
          :color="buttonColor"
          :variant="buttonVariant"
          @click="retryOperation"
          :loading="isRetrying"
          :disabled="isRetrying"
        >
          Reintentar
        </UButton>
        <UButton
          v-if="dismissable"
          size="sm"
          color="gray"
          variant="ghost"
          @click="dismiss"
        >
          Cerrar
        </UButton>
      </div>
    </template>
  </UAlert>
</template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { ErrorState, ErrorType } from '~/composables/useErrorHandling';
  
  const props = defineProps({
    error: {
      type: Object as PropType<ErrorState | null>,
      default: null
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['retry', 'dismiss']);
  
  const isRetrying = ref(false);
  
  // Alert variant (subtle by default)
  const alertVariant = computed(() => 'soft');
  
  // Alert color based on error type
  const alertColor = computed(() => {
    if (!props.error) return 'gray';
    return buttonColor.value;
  });
  
  // Map error types to icons
  const errorIconMap = {
    connection: 'i-heroicons-signal-slash',
    server: 'i-heroicons-server',
    validation: 'i-heroicons-exclamation-triangle',
    notFound: 'i-heroicons-question-mark-circle',
    unknown: 'i-heroicons-exclamation-circle'
  };
  
  const errorIcon = computed(() => {
    if (!props.error) return '';
    return errorIconMap[props.error.type] || errorIconMap.unknown;
  });
  
  // Map error types to titles
  const errorTitleMap = {
    connection: 'Problema de conexión',
    server: 'Error del servidor',
    validation: 'Datos incorrectos',
    notFound: 'No encontrado',
    unknown: 'Error inesperado'
  };
  
  const errorTitle = computed(() => {
    if (!props.error) return '';
    return errorTitleMap[props.error.type] || errorTitleMap.unknown;
  });
  
  // Button color based on error type
  const buttonColor = computed(() => {
    if (!props.error) return 'indigo';
    
    const colorMap: Record<ErrorType, string> = {
      connection: 'yellow',
      server: 'red',
      validation: 'orange',
      notFound: 'blue',
      unknown: 'gray'
    };
    
    return colorMap[props.error.type] || 'indigo';
  });
  
  const buttonVariant = computed(() => {
    return 'solid';
  });
  
  // Retry the operation
  const retryOperation = async () => {
    if (!props.error || !props.error.retry) return;
    
    isRetrying.value = true;
    emit('retry');
    
    try {
      await props.error.retry();
    } catch (e) {
      console.error('Error during retry operation:', e);
    } finally {
      isRetrying.value = false;
    }
  };
  
  // Dismiss the error
  const dismiss = () => {
    emit('dismiss');
  };
  </script>