<template>
    <div v-if="error" :class="[
      'rounded-lg p-4 mb-4 flex items-start',
      errorClasses[error.type] || errorClasses.unknown
    ]">
      <div class="mr-3 flex-shrink-0">
        <UIcon :name="errorIcon" class="h-5 w-5" />
      </div>
      <div class="flex-grow">
        <h3 class="text-sm font-medium">{{ errorTitle }}</h3>
        <div class="mt-1 text-sm">
          {{ error.message }}
          <div v-if="showDetails && error.details" class="mt-2 text-xs whitespace-pre-wrap bg-white bg-opacity-20 p-2 rounded">
            {{ JSON.stringify(error.details, null, 2) }}
          </div>
        </div>
        <div class="mt-3 flex items-center">
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
            class="ml-2"
            @click="dismiss"
          >
            Cerrar
          </UButton>
        </div>
      </div>
    </div>
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
  
  // Define styles for different error types
  const errorClasses = {
    connection: 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400',
    server: 'bg-red-50 text-red-800 border-l-4 border-red-500',
    validation: 'bg-orange-50 text-orange-800 border-l-4 border-orange-400',
    notFound: 'bg-blue-50 text-blue-800 border-l-4 border-blue-400',
    unknown: 'bg-gray-50 text-gray-800 border-l-4 border-gray-400'
  };
  
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