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
        <div v-if="diagnostic.courses && diagnostic.courses.length > 0" class="space-y-4">
          <div 
            v-for="(course, index) in diagnostic.courses" 
            :key="'course-'+index" 
            class="border border-indigo-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <h5 class="font-semibold text-indigo-900">{{ course.title || 'Curso sin título' }}</h5>
              <span class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                {{ course.difficulty || 'intermedio' }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mt-2">{{ course.description || 'Sin descripción disponible' }}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="font-medium text-indigo-600">{{ course.price || 'Precio no disponible' }}</span>
              <UButton 
                v-if="course.link" 
                size="sm" 
                color="indigo" 
                variant="ghost" 
                :to="course.link"
                @click="trackClick(course, 'course')"
              >
                Ver curso
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
          No hay cursos disponibles en este momento.
        </div>

        <h4 class="font-medium text-indigo-700 mt-6 mb-2">Servicios de automatización</h4>
        <div v-if="diagnostic.services && diagnostic.services.length > 0" class="space-y-4">
          <div 
            v-for="(service, index) in diagnostic.services" 
            :key="'service-'+index" 
            class="border border-indigo-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <h5 class="font-semibold text-indigo-900">{{ service.title || 'Servicio sin título' }}</h5>
              <span class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                {{ service.type || 'automatización' }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mt-2">{{ service.description || 'Sin descripción disponible' }}</p>
            <div class="flex justify-between items-center mt-3">
              <span class="font-medium text-indigo-600">{{ service.price || 'Precio no disponible' }}</span>
              <UButton 
                v-if="service.link" 
                size="sm" 
                color="indigo" 
                variant="ghost" 
                :to="service.link"
                @click="trackClick(service, 'service')"
              >
                Ver servicio
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
          No hay servicios disponibles en este momento.
        </div>
      </div>
      
      <!-- Componente de opciones para compartir -->
      <ShareOptions 
        v-if="userId && referralCode" 
        :user-id="userId" 
        :referral-code="referralCode" 
        :user-name="userName"
      />
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
import { onMounted, watch } from 'vue';
import type { DiagnosticResult } from '~/types/questionnaire';
import useDiagnostic from '~/composables/useDiagnostic';
import ShareOptions from './ShareOptions.vue';

const props = defineProps({
  diagnostic: {
    type: Object as PropType<DiagnosticResult>,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: ''
  },
  referralCode: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['restart']);

// Si userData no está disponible aquí, creamos un objeto de referencia vacío
const userDataRef = ref({
  diagnostic: props.diagnostic
});

const { trackRecommendationClick } = useDiagnostic(userDataRef);

// Función para registrar clics en recomendaciones
const trackClick = (item: any, itemType: 'course' | 'service') => {
  // Usamos el ID real de Airtable si está disponible, o generamos uno a partir del título
  const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');
  trackRecommendationClick(itemId, itemType);
};

// Depuración: monitoreamos cambios en el diagnóstico
watch(() => props.diagnostic, (newValue) => {
  console.log('Diagnóstico actualizado en StepResults:', newValue);
  console.log('Cursos en diagnóstico:', newValue.courses);
  console.log('Servicios en diagnóstico:', newValue.services);
}, { immediate: true, deep: true });

// Enviamos un evento de visualización de página de resultados al cargar el componente
onMounted(() => {
  console.log('Componente StepResults montado');
  console.log('Diagnóstico actual:', props.diagnostic);
  console.log('Cursos disponibles:', props.diagnostic.courses);
  console.log('Servicios disponibles:', props.diagnostic.services);
});
</script>