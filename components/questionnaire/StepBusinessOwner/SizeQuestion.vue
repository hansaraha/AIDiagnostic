<template>
  <QuestionCard title="¿Cuántos empleados tiene tu empresa?" buttonText="Continuar" :disabled="!selectedValue"
    @next="$emit('next')">

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div v-for="option in options" :key="option.value" class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="selectedValue === option.value ? ' bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="selectOption(option.value)">
        <div class="flex items-center space-x-3 p-3 sm:p-4 w-full">
          <div class="flex-1">
            <span class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{{ option.label }}</span>
          </div>
          <div v-if="selectedValue === option.value" class="flex-shrink-0 text-indigo-600 dark:text-indigo-400">
            <UIcon name="heroicons-check-circle" class="w-6 h-6" />
          </div>
        </div>
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