<template>
    <QuestionCard title="Bienvenido al Diagnóstico IA" buttonText="COMENZAR" @next="$emit('next')">
      <div class="text-gray-700 mb-4">
        <p>Este cuestionario te ayudará a evaluar tu relación con la Inteligencia Artificial y cómo mejorar tu uso profesional de estas herramientas.</p>
      </div>
    </QuestionCard>
  </template>
  
  <script setup lang="ts">
  import QuestionCard from '../ui/QuestionCard.vue';
  
  defineEmits(['next']);
  </script>