<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="gray"
      variant="ghost"
      aria-label="Toggle color mode"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
