<template>
  <QuestionCard 
    title="¿Qué tipo de negocio tienes?" 
    buttonText="SIGUIENTE" 
    :disabled="isDisabled" 
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
      
      <UFormGroup v-if="selectedValue === 'other'" label="Especificar tipo de negocio">
        <UInput v-model="otherBusinessType" placeholder="Describe tu tipo de negocio" />
      </UFormGroup>
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
    default: 'tech_startup'
  },
  otherBusinessType: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'update:otherBusinessType', 'next']);

const { businessTypeOptions } = useOptionsData();

const options = businessTypeOptions;

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const otherBusinessType = computed({
  get: () => props.otherBusinessType,
  set: (value) => emit('update:otherBusinessType', value)
});

const isDisabled = computed(() => {
  // Desactivar si no hay selección
  if (!selectedValue.value) return true;
  
  // Desactivar si se seleccionó "other" pero no se especificó
  if (selectedValue.value === 'other' && !otherBusinessType.value.trim()) return true;
  
  return false;
});

const selectOption = (value: string) => {
  selectedValue.value = value;
};
</script>