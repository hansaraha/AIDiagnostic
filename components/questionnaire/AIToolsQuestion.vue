<template>
  <QuestionCard title="¿Qué herramientas de IA usas?" subtitle="Selecciona las principales" buttonText="Continuar"
    :disabled="!hasSelection" @next="$emit('next')">

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div v-for="option in options" :key="option.value" class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="selectedTools.includes(option.value) ? ' bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="toggleOption(option.value)">
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-shrink-0 text-2xl">{{ option.emoji }}</div>
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{{ option.label }}</span>
          </div>
          <div v-if="selectedTools.includes(option.value)" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedTools.includes('sector_specific')" class="mt-4">
      <UFormGroup label="Especificar herramienta" class="mb-0">
        <UInput v-model="otherValue" placeholder="Describe tu herramienta específica y su uso" size="lg"
          class="w-full" />
      </UFormGroup>
    </div>
  </QuestionCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QuestionCard from '../ui/QuestionCard.vue';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  },
  otherTool: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'update:otherTool', 'next']);

const options = [
  { value: 'chatgpt', label: 'ChatGPT/GPT (OpenAI)', emoji: '💬' },
  { value: 'gemini', label: 'Gemini (Google)', emoji: '🌐' },
  { value: 'claude', label: 'Claude (Anthropic)', emoji: '🤖' },
  { value: 'image_ai', label: 'Midjourney/DALL-E/Stable Diffusion', emoji: '🎨' },
  { value: 'integrated', label: 'Herramientas integradas (Copilot, etc.)', emoji: '🔧' },
  { value: 'sector_specific', label: 'IA específica para mi sector', emoji: '🛠️' },
  { value: 'none', label: 'Ninguna', emoji: '❌' }
];

const selectedTools = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const otherValue = computed({
  get: () => props.otherTool,
  set: (value) => emit('update:otherTool', value)
});

const hasSelection = computed(() => selectedTools.value.length > 0);

function toggleOption(value: string) {
  const currentSelection = [...selectedTools.value];

  // If selecting 'none', clear other selections
  if (value === 'none') {
    selectedTools.value = currentSelection.includes('none') ? [] : ['none'];
    otherValue.value = '';
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
    if (value === 'sector_specific') {
      otherValue.value = '';
    }
  }

  selectedTools.value = currentSelection;
}
</script>
