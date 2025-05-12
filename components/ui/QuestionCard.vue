<template>
  <!-- Mobile version: no card styling -->
  <div class="mx-auto w-full max-w-2xl md:hidden px-4 py-5">
    <h2 class="text-xl text-center text-gray-900 dark:text-white mb-10">{{ title }}</h2>
    <p v-if="subtitle" class="text-sm text-gray-500 mb-6">{{ subtitle }}</p>

    <div class="text-gray-700 dark:text-gray-300 mb-6">
      <slot></slot>

      <UAlert v-if="showValidationMessage && disabled" color="red" variant="soft"
        icon="i-heroicons-exclamation-triangle" class="mt-4" size="sm">
        Por favor, completa esta pregunta antes de continuar.
      </UAlert>
    </div>

    <div class="flex justify-center sm:justify-end pt-4 mt-auto">
      <UButton color="indigo" variant="solid" @click="handleNextClick" :disabled="disabled && preventInvalidProgress"
        size="xl" :block="isMobile" :ui="{
          rounded: 'rounded-full',
          padding: { lg: 'py-3 px-6' }
        }">
        {{ buttonText || 'Continuar' }}
      </UButton>
    </div>
  </div>

  <!-- Desktop version with card styling -->
  <UCard
    class="container-card mx-auto w-full shadow-md dark:shadow-gray-800/20 max-w-2xl hidden md:block border border-gray-200 dark:border-gray-700 overflow-hidden"
    :ui="{
      rounded: 'rounded-xl',
      body: { padding: 'p-6' },
      header: { padding: 'px-6 py-5' },
      footer: { padding: 'px-6 py-5' }
    }">
    <template #header>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ title }}</h2>
      <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
    </template>

    <div class="text-gray-700 dark:text-gray-300">
      <slot></slot>

      <!-- Validation message -->
      <UAlert v-if="showValidationMessage && disabled" color="red" variant="soft"
        icon="i-heroicons-exclamation-triangle" class="mt-4" size="sm">
        Por favor, completa esta pregunta antes de continuar.
      </UAlert>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <UButton color="indigo" variant="solid" @click="handleNextClick" :disabled="disabled && preventInvalidProgress"
          size="lg" class="px-6 rounded-xl" :ui="{
            rounded: 'rounded-xl',
            padding: { lg: 'py-3 px-6' }
          }">
          {{ buttonText || 'Continuar' }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBreakpoints } from '@vueuse/core'

const props = defineProps({
  title: String,
  subtitle: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'Continuar'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  preventInvalidProgress: {
    type: Boolean,
    default: true
  }
})

const breakpoints = useBreakpoints({
  mobile: 768,
})

const isMobile = breakpoints.smaller('mobile')

const emit = defineEmits(['next'])

const showValidationMessage = ref(false)

const handleNextClick = () => {
  if (!props.disabled || !props.preventInvalidProgress) {
    showValidationMessage.value = false
    emit('next')
  } else {
    showValidationMessage.value = true
  }
}
</script>