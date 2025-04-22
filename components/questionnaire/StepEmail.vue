<template>
  <QuestionCard title="¿Cuál es tu correo electrónico?" buttonText="SIGUIENTE" :disabled="!isValidEmail(email)"
    @next="handleNext">
    <UFormGroup label="Email" :error="email && !isValidEmail(email) ? 'Por favor ingresa un email válido' : ''">
      <UInput v-model="email" type="email" placeholder="tu@email.com" />
    </UFormGroup>
    <p class="text-sm text-gray-500 mt-2">Te enviaremos tu diagnóstico a esta dirección de correo.</p>
  </QuestionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import QuestionCard from '../ui/QuestionCard.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'next']);

const email = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const isValidEmail = (email?: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleNext = () => {
  if (isValidEmail(email.value)) {
    emit('next');
  }
};
</script>