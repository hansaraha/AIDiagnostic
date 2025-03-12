<template>
    <UCard class="max-w-2xl mx-auto w-full bg-indigo-50 border-l-4 border-indigo-500">
      <template #header>
        <h2 class="text-xl font-bold text-gray-800">¡Genial, {{ userName }}!</h2>
      </template>
      <div class="text-gray-700 mb-4">
        <p v-html="message"></p>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <UButton color="indigo" variant="solid" @click="$emit('continue')">
            CONTINUAR
          </UButton>
        </div>
      </template>
    </UCard>
  </template>
  
  <script setup lang="ts">
  defineProps({
    message: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['continue']);
  </script>