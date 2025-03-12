<template>
    <QuestionCard 
      title="¿Qué servicios ofreces como freelancer?" 
      buttonText="SIGUIENTE" 
      :disabled="!isValid" 
      @next="$emit('next')"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          v-for="option in options" 
          :key="option.value" 
          class="border rounded p-3 cursor-pointer"
          :class="isSelected(option.value) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
          @click="toggleService(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
      
      <UFormGroup v-if="isSelected('other')" label="Especificar otro servicio" class="mt-3">
        <UInput v-model="otherService" placeholder="Describe el servicio que ofreces" />
      </UFormGroup>
    </QuestionCard>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import QuestionCard from '../../ui/QuestionCard.vue';
  import useOptionsData from '~/composables/useOptionsData';
  
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    },
    otherService: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'update:otherService', 'next']);
  
  const { freelancerServicesOptions } = useOptionsData();
  
  const options = freelancerServicesOptions;
  
  const selectedServices = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const otherService = computed({
    get: () => props.otherService,
    set: (value) => emit('update:otherService', value)
  });
  
  const isValid = computed(() => {
    if (selectedServices.value.includes('other')) {
      return selectedServices.value.length > 0 && !!otherService.value.trim();
    }
    return selectedServices.value.length > 0;
  });
  
  const isSelected = (value: string) => {
    return selectedServices.value.includes(value);
  };
  
  const toggleService = (value: string) => {
    const services = [...selectedServices.value];
    const index = services.indexOf(value);
    
    if (index === -1) {
      services.push(value);
    } else {
      services.splice(index, 1);
    }
    
    selectedServices.value = services;
  };
  </script>