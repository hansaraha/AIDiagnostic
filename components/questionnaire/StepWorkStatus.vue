<template>
  <QuestionCard title="¿Cuál es tu situación laboral actual?" buttonText="Continuar" :disabled="!selectedValue"
    @next="$emit('next')">
    <div class="space-y-4">
      <div v-for="option in options" :key="option.value" class="border rounded-lg p-3 cursor-pointer border-[#5D49F6]"
        :class="selectedValue === option.value ? ' bg-[#5D49F6] bg-opacity-10 dark:bg-opacity-20' : 'border-[#5D49F6]'"
        @click="selectOption(option.value)">
        {{ option.label }}
      </div>

      <UFormGroup v-if="selectedValue === 'other'" label="Especificar otro">
        <UInput v-model="otherValue" placeholder="Describe tu situación laboral" />
      </UFormGroup>
    </div>
  </QuestionCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QuestionCard from '../ui/QuestionCard.vue';
import useOptionsData from '~/composables/useOptionsData';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  otherWorkStatus: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'update:otherWorkStatus', 'next']);

const { workStatusOptions } = useOptionsData();

const options = workStatusOptions;

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const otherValue = computed({
  get: () => props.otherWorkStatus,
  set: (value) => emit('update:otherWorkStatus', value)
});

const selectOption = (value: string) => {
  selectedValue.value = value;
};
</script>