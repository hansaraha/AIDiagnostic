<template>
  <div class="md:hidden w-full bg-gray-900">
    <div class="w-full px-6 flex gap-7 flex-col justify-between py-2 min-h-screen relative">
      <div
        class="h-1.5 w-11/12 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500 absolute top-4 left-0 right-0 z-10">
      </div>
      <div class="flex flex-col items-center text-center pt-8 pb-2">
        <div class="w-full">
          <div class="text-center text-white mb-1 text-xs tracking-wide">DIAGNÓSTICO</div>
          <h1 class="text-5xl text-white font-bold mb-3">Mindset AI</h1>

          <div class="text-center text-white mb-2 px-2">
            <p class="text-base leading-tight">¿Tienes los conocimientos y las herramientas para dominar la revolución
              de IA</p>
            <p class="text-base font-bold mt-1">o te estás quedando atrás?</p>
          </div>
        </div>
      </div>

      <div class="text-center mb-1">
        <p class="text-cyan-400 text-sm leading-relaxed">
          Descubre tu nivel de preparación en<br>
          solo 3 minutos y desbloquea tu potencial<br>
          profesional 2025
        </p>
      </div>

      <div class="w-full mb-1 space-y-10">
        <div class="mb-2 space-y-5">
          <p class="mb-2 text-center text-white text-base">¿Cuál es tu nombre?</p>
          <UInput v-model="name" placeholder="Ingresa tu nombre"
            class="w-full rounded-lg border-1 border-indigo-600 h-12 text-base bg-transparent" color="indigo" />
        </div>
        <p class="text-2xs text-center text-gray-300 mb-3">
          Al hacer clic en Continuar aceptas los
          <a href="#" class="underline text-white">Términos y Condiciones</a>
          y la <a href="#" class="underline text-white">Política de privacidad</a>
        </p>

        <div class="sticky bottom-0 bg-gray-900 pt-2 pb-6 z-20">
          <UButton block variant="solid" class="rounded-full bg-[#6349F5] w-full h-12 text-base font-medium"
            :disabled="!name.trim()" @click="$emit('next', name)">
            Continuar
          </UButton>
        </div>
      </div>
    </div>
  </div>

  <div class="hidden md:flex items-center justify-center h-full">
    <div class="flex max-w-5xl mx-auto w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
      <div class="grid grid-cols-2 h-full">
        <div class="bg-indigo-900 text-white p-10 flex flex-col relative">
          <div
            class="h-1.5 w-11/12 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500 absolute top-6 left-0 right-0 ">
          </div>

          <div class="mt-12">
            <div class="mb-2 tracking-wide">DIAGNÓSTICO</div>
            <h1 class="text-5xl font-bold mb-6">Mindset AI</h1>

            <div class="mb-10 text-lg">
              <p>¿Tienes los conocimientos y las herramientas para dominar la revolución de IA</p>
              <p class="font-bold">o te estás quedando atrás?</p>
            </div>
          </div>

          <div class="mt-auto">
            <p class="text-cyan-400 text-lg">
              Descubre tu nivel de preparación en
              solo 3 minutos y desbloquea tu potencial
              profesional 2025
            </p>
          </div>
        </div>

        <!-- Right Column: Form -->
        <div class="p-10 flex flex-col justify-center">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">¡Bienvenido/a!</h2>

          <div class="mb-8">
            <p class="text-gray-600 dark:text-gray-300 mb-3 text-lg">Para comenzar, dinos tu nombre:</p>

            <UInput v-model="name" placeholder="Ingresa tu nombre" class="w-full" color="indigo" size="lg" />
          </div>

          <p class="text-base text-gray-500 dark:text-gray-400 mb-8">
            Este diagnóstico te ayudará a evaluar tu relación con la Inteligencia Artificial
            y cómo mejorar tu uso profesional de estas herramientas.
          </p>

          <!-- Terms text -->
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Al hacer clic en Comenzar aceptas los
            <a href="#" class="underline text-indigo-600 dark:text-indigo-400">Términos y Condiciones</a>
            y la <a href="#" class="underline text-indigo-600 dark:text-indigo-400">Política de privacidad</a>
          </p>

          <UButton color="indigo" :disabled="!name.trim()" @click="$emit('next', name)" size="lg" class="w-1/2">
            Comenzar Diagnóstico
          </UButton>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
const name = ref('');
defineEmits(['next']);
</script>