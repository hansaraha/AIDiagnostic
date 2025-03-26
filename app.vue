<template>
  <UApp :tooltip="{
    delay: 200,
    closeDelay: 100,
    openDelay: 200,
    position: 'top'
  }" :toaster="{
    position: 'top-right',
    pauseOnHover: true,
    duration: 5000
  }">
    <div class="h-full overflow-auto">
      <NuxtPage />
    </div>
  </UApp>
</template>

<script setup lang="ts">
// UApp provides global configurations for all UI components
// It wraps ToastProvider and TooltipProvider for global toasts and tooltips
// and provides control for scroll body behavior and more
</script>

<style>
html, body, #__nuxt {
  @apply h-screen;
}

.app-container {
  @apply h-full;
}
</style>