<template>
  <QuestionCard title="¿Para qué usas principalmente la IA?" buttonText="SIGUIENTE" :disabled="!hasSelection"
    @next="$emit('next')">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div v-for="option in options" :key="option.value" class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="selectedUsages.includes(option.value) ? ' bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="toggleOption(option.value)">
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-shrink-0 text-2xl">{{ option.emoji }}</div>
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{{ option.label }}</span>
          </div>
          <div v-if="selectedUsages.includes(option.value)" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  </QuestionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import QuestionCard from '../ui/QuestionCard.vue';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'next']);

const options = [
  { value: 'ideation', label: 'Generar ideas', emoji: '💡' },
  { value: 'content', label: 'Crear contenido', emoji: '📝' },
  { value: 'editing', label: 'Editar/revisar trabajo', emoji: '✍️' },
  { value: 'analysis', label: 'Analizar datos', emoji: '📊' },
  { value: 'automation', label: 'Automatizar tareas repetitivas', emoji: '⚙️' },
  { value: 'programming', label: 'Programación/código', emoji: '👨‍💻' },
  { value: 'research', label: 'Investigación', emoji: '🔍' },
  { value: 'learning', label: 'Aprendizaje', emoji: '📚' },
  { value: 'none', label: 'No la uso', emoji: '❌' }
];

const selectedUsages = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const hasSelection = computed(() => selectedUsages.value.length > 0);

function toggleOption(value: string) {
  const currentSelection = [...selectedUsages.value];

  // If selecting 'none', clear other selections
  if (value === 'none') {
    selectedUsages.value = currentSelection.includes('none') ? [] : ['none'];
    return;
  }

  // If selecting any other option, remove 'none' if present
  const index = currentSelection.indexOf(value);
  if (index === -1) {
    currentSelection.push(value);
    const noneIndex = currentSelection.indexOf('none');
    if (noneIndex !== -1) {
      currentSelection.splice(noneIndex, 1);
    }
  } else {
    currentSelection.splice(index, 1);
  }

  selectedUsages.value = currentSelection;
}
</script>
