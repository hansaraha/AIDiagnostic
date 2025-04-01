<template>
  <Teleport to="body" v-if="show">
    <div class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-5">
      <div class="space-y-8">
        <p class="font-semibold text-2xl">Sabias que...</p>
        <div class="w-full max-w-2xl px-4 py-6 bg-indigo-900/20 rounded-xl border space-y-5 border-[#5D49F6]">

          <div class="text-gray-700 dark:text-gray-300 mb-4 space-y-32">
            <p class="mb-2 text-xl font-medium">"{{ message }}"</p>
            <div v-if="source" class="text-sm text-gray-500 dark:text-gray-400 mt-2 italic border-[#5D49F6] border-t pt-3">
              Fuente: {{ source }}
            </div>
          </div>

          
        </div>
        <div class="flex justify-center pt-16">
            <UButton size="lg" block class="rounded-full" color="indigo" variant="solid" @click="handleNextClick">
              CONTINUAR
            </UButton>
          </div>
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
