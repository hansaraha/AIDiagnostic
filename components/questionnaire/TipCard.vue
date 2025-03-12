<template>
    <UCard class="max-w-2xl mx-auto w-full">
      <template #header>
        <h2 class="text-xl font-bold text-gray-800">Consejo Profesional</h2>
      </template>
      <div class="text-gray-700 mb-4">
        <p>{{ tip }}</p>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <UButton color="indigo" variant="solid" @click="$emit('next')">
            CONTINUAR
          </UButton>
        </div>
      </template>
    </UCard>
  </template>
  
  <script setup lang="ts">
  defineProps({
    tip: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['next']);
  </script>