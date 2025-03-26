<template>
  <QuestionCard 
    title="¿En qué sector trabajas principalmente?" 
    buttonText="SIGUIENTE" 
    :disabled="!selectedValue" 
    @next="$emit('next')"
  >
    <!-- Options grid with better responsive layout -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div 
        v-for="option in options" 
        :key="option.value" 
         class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="selectedValue === option.value ? ' bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="selectOption(option.value)"
      >
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-shrink-0 text-2xl">{{ option.emoji }}</div>
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{{ option.label }}</span>
          </div>
          <div v-if="selectedValue === option.value" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Other sector input with improved styling -->
    <div v-if="selectedValue === 'other'" class="mt-4">
      <UFormGroup label="Especificar otro sector" class="mb-0">
        <UInput 
          v-model="otherValue" 
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
import QuestionCard from '../ui/QuestionCard.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  otherSector: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'update:otherSector', 'next']);

const options = [
  { value: 'tech', label: 'Tecnología/Software', emoji: '💻' },
  { value: 'design', label: 'Diseño y creatividad', emoji: '🎨' },
  { value: 'marketing', label: 'Marketing y publicidad', emoji: '📊' },
  { value: 'media', label: 'Medios y comunicación', emoji: '📱' },
  { value: 'education', label: 'Educación y formación', emoji: '🏫' },
  { value: 'consulting', label: 'Consultoría', emoji: '📈' },
  { value: 'finance', label: 'Finanzas', emoji: '💰' },
  { value: 'health', label: 'Salud', emoji: '⚕️' },
  { value: 'retail', label: 'Retail/Comercio', emoji: '🛒' },
  { value: 'manufacturing', label: 'Manufactura', emoji: '🏭' },
  { value: 'other', label: 'Otro', emoji: '🌐' }
];

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const otherValue = computed({
  get: () => props.otherSector,
  set: (value) => emit('update:otherSector', value)
});

function selectOption(value: string) {
  selectedValue.value = value;
  if (value !== 'other') {
    otherValue.value = '';
  }
}
</script>

<style scoped>
/* Add animation effects */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.grid > div {
  animation: fadeIn 0.3s ease-out;
}

/* Stagger the animations */
.grid > div:nth-child(2n) {
  animation-delay: 0.05s;
}

.grid > div:nth-child(3n) {
  animation-delay: 0.1s;
}

.grid > div:nth-child(4n) {
  animation-delay: 0.15s;
}
</style>
