<template>
    <QuestionCard 
      title="¿Qué plataformas utilizas para encontrar clientes?" 
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
          @click="togglePlatform(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
      
      <UFormGroup v-if="isSelected('other')" label="Especificar otra plataforma" class="mt-3">
        <UInput v-model="otherPlatform" placeholder="Nombre de la plataforma" />
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
    otherPlatform: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'update:otherPlatform', 'next']);
  
  const { freelancerPlatformsOptions } = useOptionsData();
  
  const options = freelancerPlatformsOptions;
  
  const selectedPlatforms = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const otherPlatform = computed({
    get: () => props.otherPlatform,
    set: (value) => emit('update:otherPlatform', value)
  });
  
  const isValid = computed(() => {
    if (selectedPlatforms.value.includes('other')) {
      return selectedPlatforms.value.length > 0 && !!otherPlatform.value.trim();
    }
    return selectedPlatforms.value.length > 0;
  });
  
  const isSelected = (value: string) => {
    return selectedPlatforms.value.includes(value);
  };
  
  const togglePlatform = (value: string) => {
    const platforms = [...selectedPlatforms.value];
    const index = platforms.indexOf(value);
    
    if (index === -1) {
      platforms.push(value);
    } else {
      platforms.splice(index, 1);
    }
    
    selectedPlatforms.value = platforms;
  };
  </script>