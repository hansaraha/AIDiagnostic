<template>
    <UCard class="max-w-2xl mx-auto w-full">
      <template #header>
        <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
      </template>
      
      <div class="text-gray-700 mb-4">
        <slot></slot>
      </div>
      
      <template #footer>
        <div class="flex justify-center">
          <UButton 
            color="indigo" 
            variant="solid" 
            @click="$emit('next')" 
            :disabled="disabled"
          >
            {{ buttonText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </template>
  
  <script setup lang="ts">
  defineProps({
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
    }
  });
  
  defineEmits(['next']);
  </script>