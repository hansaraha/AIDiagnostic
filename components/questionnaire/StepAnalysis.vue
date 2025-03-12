<template>
    <UCard class="max-w-2xl mx-auto w-full bg-gradient-to-r from-indigo-50 to-white">
      <template #header>
        <h2 class="text-xl font-bold text-indigo-800">¡Estoy analizando tu perfil!</h2>
      </template>
      <div class="text-gray-700 mb-4 flex flex-col items-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="text-indigo-500 animate-spin h-12 w-12 mb-4" />
        <p class="text-center mb-4">
          Estoy generando recomendaciones personalizadas para tu perfil 
          <span class="font-semibold text-indigo-700">{{ profileDescription }}</span>
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div class="bg-indigo-600 h-2 rounded-full animate-pulse" style="width: 75%"></div>
        </div>
        <p class="text-sm text-gray-500 mt-3">Este análisis es 100% personalizado según tus respuestas</p>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <UButton 
            color="indigo" 
            variant="solid" 
            @click="$emit('analyze')"
            :loading="isAnalyzing"
            :disabled="isAnalyzing"
          >
            VER RESULTADOS
          </UButton>
        </div>
      </template>
    </UCard>
  </template>
  
  <script setup lang="ts">
  defineProps({
    profileDescription: {
      type: String,
      required: true
    },
    isAnalyzing: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['analyze']);
  </script>