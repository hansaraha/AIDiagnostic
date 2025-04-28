<template>
  <div class="step-analysis-container">
    <div
      class="h-1.5 w-11/12 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500 absolute top-6 left-0 right-0">
    </div>
    <div class="max-w-xl mx-auto text-center space-y-20 p-5">
      <div class="space-y-3">
        <div>
          <p>DIAGNÓSTICO</p>
        </div>
        <div>
          <p class="text-5xl font-bold">Mindset AI</p>
        </div>
      </div>
      <div>
        <div
          class="rounded-2xl border border-[#5D49F6] bg-[#403397] bg-opacity-20 p-8 flex items-center justify-center">
          <div class="text-center space-y-20">
            <div class="space-y-3">
              <div>
                <p class="text-[#FF6B3C] font-bold text-3xl">¡Excelente!</p>
              </div>
              <div>
                <p class="text-2xl font-bold">La IA va a transformar la forma en que todos trabajamos, no te quedes
                  atrás!</p>
              </div>
            </div>
            <div>
              <p class="text-xl">Enviaremos al correo que nos proporcionaste el resultado para saber que tan adelante
                estás en el uso de la IA en tu sector y que puedes hacer para sobresalir.</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <UButton size="lg" :ui="{
          rounded: 'rounded-full',
          padding: { lg: 'py-5 px-6' }
        }" :block="isMobile" @click="handleAnalyze" :loading="analyzing">
          Finalizar
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  analyzing: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  }
});

const breakpoints = useBreakpoints({
  mobile: 768,
});

const isMobile = breakpoints.smaller('mobile');

const emit = defineEmits(['analyze', 'clearError']);

const handleAnalyze = () => {
  emit('analyze');
};

const handleClearError = () => {
  console.log("Clear error called");
  emit('clearError');
};
</script>
