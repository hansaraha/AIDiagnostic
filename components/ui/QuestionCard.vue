<template>
  <UCard class="max-w-2xl mx-auto w-full">
    <template #header>
      <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
    </template>
    
    <div class="text-gray-700 mb-4">
      <slot></slot>
      
      <!-- Mensaje de validación que aparece cuando se intenta continuar sin una selección válida -->
      <div v-if="showValidationMessage && disabled" class="mt-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">
        Por favor, completa esta pregunta antes de continuar.
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-center">
        <UButton 
          color="indigo" 
          variant="solid" 
          @click="handleNextClick" 
          :disabled="disabled && preventInvalidProgress"
        >
          {{ buttonText }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: 'SIGUIENTE'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // Nueva propiedad para controlar si se debe prevenir estrictamente el avance
  preventInvalidProgress: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['next']);

// Estado para mostrar mensaje de validación
const showValidationMessage = ref(false);

// Manejar clic en el botón de siguiente
const handleNextClick = () => {
  if (!props.disabled || !props.preventInvalidProgress) {
    // Si no está deshabilitado o no estamos previniendo el avance estrictamente, permitir avanzar
    showValidationMessage.value = false;
    emit('next');
  } else {
    // Mostrar mensaje de validación si está deshabilitado
    showValidationMessage.value = true;
  }
};
</script>