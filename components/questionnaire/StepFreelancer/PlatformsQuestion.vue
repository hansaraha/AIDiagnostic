<template>
  <QuestionCard 
    title="¿Qué plataformas utilizas para encontrar clientes?" 
    buttonText="SIGUIENTE" 
    :disabled="isDisabled" 
    @next="$emit('next')"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div 
        v-for="option in options" 
        :key="option.value" 
         class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="isSelected(option.value) ? ' bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="togglePlatform(option.value)"
      >
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{{ option.label }}</span>
          </div>
          <div v-if="isSelected(option.value)" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="isSelected('other')" class="mt-4">
      <UFormGroup label="Especificar otro sector" class="mb-0">
        <UInput 
          v-model="otherPlatform" 
          placeholder="Describe tu sector" 
          size="lg"
          class="w-full"
        />
      </UFormGroup>
    </div>
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

const isDisabled = computed(() => {
  // Desactivar si no hay selecciones
  if (selectedPlatforms.value.length === 0) return true;
  
  // Desactivar si se seleccionó "other" pero no se especificó
  if (selectedPlatforms.value.includes('other') && !otherPlatform.value.trim()) return true;
  
  return false;
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