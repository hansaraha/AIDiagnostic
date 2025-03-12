<template>
    <QuestionCard 
      title="¿Cuántos empleados tiene tu empresa?" 
      buttonText="SIGUIENTE" 
      @next="$emit('next')"
    >
      <div class="space-y-4">
        <div 
          v-for="option in options" 
          :key="option.value" 
          class="border rounded p-3 cursor-pointer"
          :class="selectedValue === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </QuestionCard>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import QuestionCard from '../../ui/QuestionCard.vue';
  import useOptionsData from '~/composables/useOptionsData';
  
  const props = defineProps({
    modelValue: {
      type: String,
      default: 'solo'
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'next']);
  
  const { businessSizeOptions } = useOptionsData();
  
  const options = businessSizeOptions;
  
  const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const selectOption = (value: string) => {
    selectedValue.value = value;
  };
  </script>