<template>
  <div class="w-full">
    <div class="flex justify-end items-center mt-2">
      <div class="text-xs sm:text-sm mb-1 text-indigo-600 dark:text-white font-thin">
        {{ currentStepNumber }} de {{ totalSteps }}
      </div>
    </div>
    <div class="h-1.5 w-full bg-gray-200 dark:bg-[#5f72a2] rounded-full overflow-hidden">
      <div class="h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-300 ease-in-out"
        :style="{ width: `${progress}%` }"></div>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    required: true
  },
  sectionText: {
    type: String,
    required: true
  },
  currentStepNumber: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  }
});
</script>