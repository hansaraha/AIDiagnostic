<template>
    <UCard class="max-w-2xl mx-auto w-full">
      <template #header>
        <h2 class="text-xl font-bold text-indigo-900">Tu Diagnóstico IA</h2>
      </template>
      <div class="text-gray-700 mb-4">
        <div class="mb-6">
          <h3 class="font-bold text-lg text-indigo-800 mb-2">¡Hola {{ userName }}!</h3>
          <p class="mb-4">Hemos analizado tus respuestas y generado un perfil profesional para ti:</p>
          <div class="bg-indigo-50 p-4 rounded-lg mb-4">
            <h4 class="font-bold text-indigo-800">Tu perfil es: {{ diagnostic.professionalProfile }}</h4>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-bold text-lg text-indigo-800 mb-2">Tus Fortalezas</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="(strength, index) in diagnostic.strengths" :key="index">
              {{ strength }}
            </li>
          </ul>
        </div>
        
        <div class="mb-6">
          <h3 class="font-bold text-lg text-indigo-800 mb-2">Recomendaciones</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li v-for="(recommendation, index) in diagnostic.recommendations" :key="index">
              {{ recommendation }}
            </li>
          </ul>
        </div>
  
        <div class="mb-6">
          <h3 class="font-bold text-lg text-indigo-800 mb-2">Recomendaciones personalizadas para ti, {{ userName }}</h3>
          
          <h4 class="font-medium text-indigo-700 mt-4 mb-2">Cursos recomendados</h4>
          <div class="space-y-4">
            <div 
              v-for="(course, index) in diagnostic.courses" 
              :key="'course-'+index" 
              class="border border-indigo-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <h5 class="font-semibold text-indigo-900">{{ course.title }}</h5>
                <span class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                  {{ course.difficulty }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mt-2">{{ course.description }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="font-medium text-indigo-600">{{ course.price || 'Precio no disponible' }}</span>
                <UButton v-if="course.link" size="sm" color="indigo" variant="ghost" :to="course.link">
                  Ver curso
                </UButton>
              </div>
            </div>
          </div>
  
          <h4 class="font-medium text-indigo-700 mt-6 mb-2">Servicios de automatización</h4>
          <div class="space-y-4">
            <div 
              v-for="(service, index) in diagnostic.services" 
              :key="'service-'+index" 
              class="border border-indigo-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <h5 class="font-semibold text-indigo-900">{{ service.title }}</h5>
                <span class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                  {{ service.type }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mt-2">{{ service.description }}</p>
              <div class="flex justify-between items-center mt-3">
                <span class="font-medium text-indigo-600">{{ service.price || 'Precio no disponible' }}</span>
                <UButton v-if="service.link" size="sm" color="indigo" variant="ghost" :to="service.link">
                  Ver servicio
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-center">
          <UButton color="indigo" variant="solid" @click="$emit('restart')">
            COMENZAR DE NUEVO
          </UButton>
        </div>
      </template>
    </UCard>
  </template>
  
  <script setup lang="ts">
  import type { DiagnosticResult } from '~/types/questionnaire';
  
  defineProps({
    diagnostic: {
      type: Object as PropType<DiagnosticResult>,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['restart']);
  </script>