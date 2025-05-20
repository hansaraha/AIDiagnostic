<template>
  <Teleport to="body" v-if="show">
    <div :style="{ backgroundImage: `url('/images/blob-trans.png')` }"
      class="fixed inset-0 bg-[#292859] z-50 flex flex-col justify-between px-5 bg-no-repeat bg-right md:bg-center min-h-screen">
      <div class="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto py-8 overflow-y-auto">
        <p class="font-semibold text-3xl text-white mb-8">Sabìas que...</p>
        <div
          class="w-full relative px-4 py-6 bg-indigo-950 bg-opacity-50 backdrop-blur-lg rounded-xl border space-y-5 border-[#5D49F6]">
          <div class="text-gray-700 dark:text-gray-300 mb-4 space-y-32">
            <p class="mb-2 text-xl font-medium text-white">"{{ message }}"</p>
            <div v-if="source" class="text-sm text-gray-200 mt-2 italic border-[#5D49F6] border-t pt-3">
              Fuente: {{ source }}
            </div>
          </div>
        </div>
      </div>
      <div class="sticky bottom-0 bg-[#292859] pt-8 pb-6 z-10 flex justify-center">
        <UButton size="lg" block class="rounded-full h-[60px] font-bold" color="indigo" variant="solid"
          @click="handleNextClick">
          CONTINUAR
        </UButton>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['next']);

// Estado para controlar la animación de entrada con una transición suave
const showCard = ref(false);

// Observar cambios en la propiedad show y actualizar inmediatamente
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Si se muestra el stopper, activar la animación de entrada
    setTimeout(() => {
      showCard.value = true;
    }, 50);
  } else {
    // Si se oculta el stopper, reset el estado
    showCard.value = false;
  }
}, { immediate: true });

// Manejo del evento para continuar
const handleNextClick = () => {
  // Animar salida antes de emitir el evento next
  showCard.value = false;
  console.log('Stopper next button clicked');
  // Esperar a que termine la animación antes de continuar
  setTimeout(() => {
    emit('next');
  }, 300);
};
</script>

<style scoped>
.card-stopper {
  transition: all 0.3s ease-in-out;
  transform: translateY(0);
  opacity: 1;
}

.card-stopper-enter-from,
.card-stopper-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
