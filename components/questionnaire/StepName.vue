<template>
  <QuestionCard 
    title="¿Cuál es tu nombre?" 
    buttonText="SIGUIENTE" 
    :disabled="!name.trim()" 
    @next="$emit('next')"
  >
    <UFormGroup label="Nombre">
      <UInput v-model="name" placeholder="Tu nombre" />
    </UFormGroup>
  </QuestionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import QuestionCard from '../ui/QuestionCard.vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'next']);

const name = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>