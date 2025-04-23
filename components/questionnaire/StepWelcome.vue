<template>
  <!-- Mobile version: full screen with no extra space -->
  <div class="md:hidden w-full min-h-screen h-full fixed inset-0 overflow-y-auto">
    <div class="w-full px-6 flex flex-col min-h-screen justify-between py-4">
      <div
        class="h-1.5 w-11/12 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-pink-500 absolute top-6 left-0 right-0 ">
      </div>
      <!-- Main content wrapper with precise spacing -->
      <div class="flex flex-col items-center text-center flex-1 pt-12 pb-4">
        <!-- Header section with precise spacing -->
        <div class="w-full">
          <div class="text-center mb-2 text-sm tracking-wide">DIAGNÓSTICO</div>
          <h1 class="text-6xl font-bold mb-5">Mindset AI</h1>

          <div class="text-center mb-4 px-4">
            <p class="text-base leading-tight">¿Tienes los conocimientos y las herramientas para dominar la revolución
              de IA</p>
            <p class="text-base font-bold mt-1">o te estás quedando atrás?</p>
          </div>
        </div>
      </div>

      <!-- Middle section with catchphrase - positioned exactly as shown in the image -->
      <div class="text-center mb-20">
        <p class="text-cyan-400 text-sm leading-relaxed">
          Descubre tu nivel de preparación en<br>
          solo 3 minutos y desbloquea tu potencial<br>
          profesional 2025
        </p>
      </div>

      <!-- Bottom section with form -->
      <div class="w-full mb-6">
        <!-- Name input -->
        <div class="mb-4">
          <p class="mb-3 text-center text-lg">¿Cuál es tu nombre?</p>
          <UInput v-model="name" placeholder="Ingresa tu nombre"
            class="w-full rounded-lg border-2 border-indigo-600 h-12 text-base bg-transparent" color="indigo" />
        </div>

        <!-- Terms text -->
        <p class="text-2xs text-center text-gray-300 mb-5">
          Al hacer clic en Continuar aceptas los
          <a href="#" class="underline text-white">Términos y Condiciones</a>
          y la <a href="#" class="underline text-white">Política de privacidad</a>
        </p>

        <!-- Button - matched to purple from image -->
        <UButton block variant="solid" class="rounded-full bg-[#6349F5] w-full h-14 text-lg font-medium"
          :disabled="!name.trim()" @click="$emit('next', name)">
          Continuar
        </UButton>
      </div>
    </div>
  </div>

  <!-- Desktop version: full height card -->
  <div class="hidden md:flex items-center justify-center h-full">
    <div class="flex max-w-5xl mx-auto w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
      <div class="grid grid-cols-2 h-full">
        <!-- Left Column: Image/Branding -->
        <div class="bg-indigo-900 text-white p-10 flex flex-col relative">
          <!-- Gradient line at top -->
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