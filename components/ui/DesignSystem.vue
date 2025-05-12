<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
    <h1 class="text-2xl font-bold text-indigo-900 mb-8">AI Diagnostic Design System</h1>

    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Typography</h2>
      <div class="space-y-4">
        <div>
          <h1 class="text-2xl font-bold text-indigo-900">Page Title</h1>
          <p class="text-sm text-gray-500">text-2xl, font-bold, text-indigo-900</p>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-800">Section Title</h2>
          <p class="text-sm text-gray-500">text-xl, font-bold, text-gray-800</p>
        </div>
        <div>
          <p class="text-gray-700">Regular text for questions and content</p>
          <p class="text-sm text-gray-500">text-gray-700</p>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Buttons</h2>
      <div class="flex flex-wrap gap-4">
        <UButton color="indigo">Primary Button</UButton>
        <UButton color="indigo" variant="soft">Secondary Button</UButton>
        <UButton color="indigo" variant="ghost">Tertiary Button</UButton>
        <UButton color="indigo" disabled>Disabled Button</UButton>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Question Card</h2>
      <UCard>
        <template #header>
          <h3 class="text-xl font-bold text-gray-800">¿Cómo te sientes acerca de la IA?</h3>
        </template>
        <div class="text-gray-700 mb-4">
          <div class="space-y-4">
            <div class="border rounded p-3 cursor-pointer border-indigo-500 bg-indigo-50">
              Emocionado por las posibilidades
            </div>
            <div class="border rounded p-3 cursor-pointer border-gray-200">
              Neutro, esperando ver resultados
            </div>
            <div class="border rounded p-3 cursor-pointer border-gray-200">
              Preocupado por el impacto
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-center">
            <UButton color="indigo">Continuar</UButton>
          </div>
        </template>
      </UCard>
    </section>

    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Stopper/Tip Cards</h2>
      <div class="space-y-6">
        <div class="card-stopper">
          <h3 class="font-bold text-indigo-800 mb-2">¿Sabías que?</h3>
          <p>El 85% de las empresas consideran que la IA será una ventaja competitiva clave en los próximos años.</p>
        </div>

        <div class="card-tip">
          <h3 class="font-bold text-yellow-800 mb-2">Consejo</h3>
          <p>Considera comenzar con proyectos pequeños de IA para ganar experiencia antes de implementaciones más
            grandes.
          </p>
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Email Card</h2>
      <div class="card-email">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Recibe tu diagnóstico completo</h3>
        <p class="text-gray-700 mb-4">Ingresa tu correo electrónico para recibir un análisis detallado:</p>
        <div class="mb-4">
          <UInput placeholder="correo@ejemplo.com" />
        </div>
        <UButton color="indigo">ENVIAR</UButton>
      </div>
    </section>

    <section>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Results Card</h2>
      <div class="card-result">
        <h3 class="text-xl font-bold text-indigo-900 mb-4">Tu perfil: IA-Estratega</h3>
        <div class="mb-4 p-4 bg-indigo-50 rounded-md">
          <p class="font-medium">Puntuación total: 78/100</p>
        </div>
        <p class="text-gray-700 mb-4">Has demostrado un enfoque estratégico hacia la adopción de IA en tu negocio,
          identificando oportunidades clave para implementación.</p>
        <div class="border-t border-gray-200 pt-4 mt-4">
          <h4 class="font-bold text-gray-800 mb-2">Recomendaciones principales:</h4>
          <ul class="list-disc pl-5 text-gray-700">
            <li>Establecer un plan de implementación de IA a largo plazo</li>
            <li>Invertir en capacitación para tu equipo</li>
            <li>Evaluar soluciones de IA específicas para tu sector</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// No additional script setup needed
</script>
