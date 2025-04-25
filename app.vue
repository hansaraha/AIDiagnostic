<template>
  <div :tooltip="{
    delay: 200,
    closeDelay: 100,
    openDelay: 200,
    position: 'top'
  }" :toaster="{
    position: 'top-right',
    pauseOnHover: true,
    duration: 5000
  }" class=" min-h-screen h-full w-full ">
    <div class="h-full overflow-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">


</script>

<style>
html,
body,
#__nuxt {
  @apply h-screen;
}

.app-container {
  @apply h-full;
}
</style>